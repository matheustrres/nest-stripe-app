import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type UserWithSubscription = {
	user: UserEntity;
	subscription?: SubscriptionEntity;
};

export abstract class SubscriptionsService {
	abstract fetchUserWithSubscription(
		userId: string,
	): Promise<UserWithSubscription>;
	abstract validateSubscriptionPolicy(
		model: AIModelEnum,
		chatType: ChatTypeEnum,
		planLevel: VendorPlanLevelEnum,
	): void;
}
