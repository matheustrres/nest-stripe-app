import { Injectable } from '@nestjs/common';

import { AIService } from '../services/ai.service';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { UseCase } from '@/@core/application/use-case';
import { OrderByEnum } from '@/@core/types';

import { InvalidResponseActionError } from '@/modules/chats/application/errors/invalid-response-action.error';
import { MessageNotFoundError } from '@/modules/chats/application/errors/message-not-found.error';
import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { MessagesRepository } from '@/modules/chats/application/repositories/messages.repository';
import { ResponsesRepository } from '@/modules/chats/application/repositories/responses.repository';
import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { MessageEntity } from '@/modules/chats/domain/message.entity';
import { ResponseEntity } from '@/modules/chats/domain/response.entity';
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
		private readonly usersRepository: UsersRepository,
		private readonly messagesRepository: MessagesRepository,
		private readonly subscriptionTokensService: SubscriptionTokensService,
		private readonly chatsRepository: ChatsRepository,
		private readonly aiService: AIService,
		private readonly responsesRepository: ResponsesRepository,
	) {}

	async exec({
		userId,
		messageId,
		model,
	}: CreateResponseUseCaseInput): Promise<CreateResponseUseCaseOutput> {
		const { user, subscription } =
			await this.#fetchUserWithSubscription(userId);

		const isSubscriptionValid = this.#isSubscriptionValid(subscription);
		if (!isSubscriptionValid)
			throw InvalidResponseActionError.byInvalidSubscription();

		const message = await this.#fetchMessage(messageId);
		const { chatId, content: msgContent } = message.getProps();

		const { tokens } = user.getProps();

		const estimatedTokensUsage =
			this.subscriptionTokensService.estimateTokensUsage(msgContent, model);
		if (estimatedTokensUsage > tokens.amount)
			throw InvalidResponseActionError.byInsufficientTokens();

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

		const result = await this.aiService.genContent({
			chatPreviousMessages: chatMessagesWithResponses,
			model,
			prompt: lastMsgContent,
		});

		const response = ResponseEntity.createNew({
			content: result,
			messageId: message.id,
			model,
		});

		await this.responsesRepository.upsert(response);

		return {
			response,
		};
	}

	async #fetchUserWithSubscription(
		userId: string,
	): Promise<UserWithSubscription> {
		const user = await this.usersRepository.findById(userId, {
			relations: {
				subscription: true,
			},
		});
		if (!user) throw new InvalidCredentialsError();

		const { subscription } = user.getProps();

		return {
			user,
			subscription,
		};
	}

	#isSubscriptionValid(subscription?: SubscriptionEntity): boolean {
		return !!(subscription && subscription.getProps().status.isActive());
	}

	async #fetchMessage(messageId: string): Promise<MessageEntity> {
		const message = await this.messagesRepository.findOne(messageId);
		if (!message) throw MessageNotFoundError.byId(messageId);
		return message;
	}
}

type UserWithSubscription = {
	user: UserEntity;
	subscription?: SubscriptionEntity;
};
