import { Injectable } from '@nestjs/common';

import { UseCase } from '@/@core/application/use-case';
import { EnvService } from '@/@core/config/env/env.service';
import { VendorCatalogProductSectionsEnum } from '@/@core/domain/constants/vendor-products-catalog';
import { VendorProductsCatalogService } from '@/@core/domain/services/vendor-products-catalog.service';
import { OrderByEnum } from '@/@core/types';

import { InvalidResponseActionError } from '@/modules/chats/application/errors/invalid-response-action.error';
import { MessageNotFoundError } from '@/modules/chats/application/errors/message-not-found.error';
import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { MessagesRepository } from '@/modules/chats/application/repositories/messages.repository';
import { ResponsesRepository } from '@/modules/chats/application/repositories/responses.repository';
import { AIService } from '@/modules/chats/application/services/ai.service';
import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { MessageEntity } from '@/modules/chats/domain/message.entity';
import { ResponseEntity } from '@/modules/chats/domain/response.entity';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { SubscriptionsService } from '@/modules/subscriptions/application/services/subscriptions.service';
import { SubscriptionTokensService } from '@/modules/subscriptions/application/services/tokens.service';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type CreateResponseUseCaseInput = {
	userId: string;
	messageId: string;
	model: AIModelEnum;
	chatType: ChatTypeEnum;
};

export type CreateResponseUseCaseOutput = {
	response: ResponseEntity;
};

@Injectable()
export class CreateResponseUseCase
	implements UseCase<CreateResponseUseCaseInput, CreateResponseUseCaseOutput>
{
	constructor(
		private readonly aiService: AIService,
		private readonly chatsRepository: ChatsRepository,
		private readonly envService: EnvService,
		private readonly messagesRepository: MessagesRepository,
		private readonly productsCatalogService: VendorProductsCatalogService,
		private readonly responsesRepository: ResponsesRepository,
		private readonly subscriptionsService: SubscriptionsService,
		private readonly subscriptionTokensService: SubscriptionTokensService,
		private readonly usersRepository: UsersRepository,
	) {}

	async exec({
		model,
		chatType,
		userId,
		messageId,
	}: CreateResponseUseCaseInput): Promise<CreateResponseUseCaseOutput> {
		const { user, subscription: userSubscription } =
			await this.subscriptionsService.fetchUserWithSubscription(userId);

		const isSubscriptionValid = this.#isSubscriptionValid(userSubscription);
		if (!isSubscriptionValid) {
			throw InvalidResponseActionError.byInvalidSubscription();
		}

		const validatedUserSubscription = userSubscription as SubscriptionEntity;
		const { vendorProductId, vendorSubscriptionId } =
			validatedUserSubscription.getProps();

		const environment = this.envService.getKeyOrThrow('NODE_ENV');

		const vendorPlanFindingResult =
			this.productsCatalogService.getCatalogSessionProduct(
				VendorCatalogProductSectionsEnum.Plans,
				environment,
				vendorProductId,
			);
		if (vendorPlanFindingResult.isLeft()) {
			throw SubscriptionNotFoundError.byCurrentSubscription(
				vendorSubscriptionId,
			);
		}

		const vendorPlan = vendorPlanFindingResult.value;

		this.subscriptionsService.validateSubscriptionPolicy(
			model,
			chatType,
			vendorPlan.level,
		);

		const message = await this.#fetchMessage(messageId);

		const { chatId } = message.getProps();
		const { tokens } = user.getProps();

		this.#validateEstimatedTokensUsed(model, tokens.amount);

		const chatMessagesWithResponses =
			await this.chatsRepository.listChatMessages(chatId.value, {
				orderBy: OrderByEnum.Ascending,
				relations: {
					messageResponse: true,
				},
			});
		const lastChatMessageWithoutResponse =
			chatMessagesWithResponses.pop() as MessageEntity;
		const { content: lastMsgContent } =
			lastChatMessageWithoutResponse.getProps();

		const { data, tokensUsed } = await this.aiService.genContent({
			chatPreviousMessages: chatMessagesWithResponses,
			model,
			prompt: lastMsgContent,
		});

		await this.#handleTokensSubtraction(user, tokensUsed);

		const response = ResponseEntity.createNew({
			content: data,
			messageId: message.id,
			model,
		});

		await this.responsesRepository.upsert(response);

		return {
			response,
		};
	}

	#isSubscriptionValid(subscription?: SubscriptionEntity): boolean {
		return !!subscription && subscription.getProps().status.isActive();
	}

	async #fetchMessage(messageId: string): Promise<MessageEntity> {
		const message = await this.messagesRepository.findOne(messageId);
		if (!message) throw MessageNotFoundError.byId(messageId);
		return message;
	}

	#validateEstimatedTokensUsed(model: AIModelEnum, userTokens: number): void {
		const modelAvgTokensPerRequest =
			this.subscriptionTokensService.getModelAvgTokensPerRequest(model);
		const estimateTokensUsage =
			this.subscriptionTokensService.calculateTokensUsage(
				modelAvgTokensPerRequest,
				model,
			);
		if (estimateTokensUsage > userTokens)
			throw InvalidResponseActionError.byInsufficientTokens();
	}

	async #handleTokensSubtraction(
		user: UserEntity,
		tokensToSubtract: number,
	): Promise<void> {
		const { tokens } = user.getProps();

		if (tokensToSubtract > tokens.amount)
			throw InvalidResponseActionError.byInsufficientTokens();

		tokens.subtract(tokensToSubtract);
		user.update({ tokens });

		await this.usersRepository.upsert(user);
	}
}
