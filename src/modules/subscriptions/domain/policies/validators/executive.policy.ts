import { Either, left, right } from '@/@core/domain/logic/either';
import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionPolicyViolationError } from '@/modules/subscriptions/domain/policies/errors/subscription-policy-violation.error';
import { SubscriptionPolicy } from '@/modules/subscriptions/domain/policies/subscription.policy';

export class ExecutiveSubscriptionPolicyValidator extends SubscriptionPolicy {
	protected readonly validAIModels: AIModelEnum[] = [
		AIModelEnum.Gemini1_0Pro,
		AIModelEnum.Gemini1_5Flash,
		AIModelEnum.Gemini1_5Pro,
	];
	protected readonly validChats: ChatTypeEnum[] = [
		ChatTypeEnum.ConsumerLaw,
		ChatTypeEnum.DraftingLegalDocuments,
		ChatTypeEnum.LegalResearch,
		ChatTypeEnum.QuickSearch,
	];

	validate(): Either<Error, void> {
		if (!this.isValidAIModel() || !this.isValidChat()) {
			return left(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Executive,
				),
			);
		}
		return right(void 0);
	}
}
