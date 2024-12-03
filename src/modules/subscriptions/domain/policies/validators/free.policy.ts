import { Either, left, right } from '@/@core/domain/logic/either';
import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionPolicyViolationError } from '@/modules/subscriptions/domain/policies/errors/subscription-policy-violation.error';
import { SubscriptionPolicy } from '@/modules/subscriptions/domain/policies/subscription.policy';

export class FreeSubscriptionPolicyValidator extends SubscriptionPolicy {
	protected validAIModels: AIModelEnum[] = [AIModelEnum.Gemini1_0Pro];
	protected validChats: ChatTypeEnum[] = [ChatTypeEnum.QuickSearch];

	validate(): Either<Error, void> {
		if (!this.isValidAIModel() || !this.isValidChat()) {
			return left(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Free,
				),
			);
		}
		return right(void 0);
	}
}
