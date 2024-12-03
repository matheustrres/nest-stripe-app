import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { InvalidResponseActionError } from '@/modules/chats/application/errors/invalid-response-action.error';
import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionPolicyFactoryService } from '@/modules/subscriptions/application/services/subscription-policy-factory.service';
import {
	SubscriptionsService,
	UserWithSubscription,
} from '@/modules/subscriptions/application/services/subscriptions.service';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

@Injectable()
export class SubscriptionsServiceAdapter implements SubscriptionsService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly subscriptionPolicyFactoryService: SubscriptionPolicyFactoryService,
	) {}

	async fetchUserWithSubscription(
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

	validateSubscriptionPolicy(
		model: AIModelEnum,
		chatType: ChatTypeEnum,
		planLevel: VendorPlanLevelEnum,
	): void {
		const policy = this.subscriptionPolicyFactoryService.createPolicy({
			aiModel: model,
			chatType,
			planLevel,
		});

		const policyValidationResult = policy.validate();

		if (policyValidationResult.isLeft()) {
			throw new InvalidResponseActionError(
				policyValidationResult.value.message,
			);
		}
	}
}
