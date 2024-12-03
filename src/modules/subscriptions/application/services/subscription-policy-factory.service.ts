import { Injectable } from '@nestjs/common';

import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionPolicyViolationError } from '@/modules/subscriptions/domain/policies/errors/subscription-policy-violation.error';
import { SubscriptionPolicy } from '@/modules/subscriptions/domain/policies/subscription.policy';
import { EssentialSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/essential.policy';
import { ExecutiveSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/executive.policy';
import { FreeSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/free.policy';
import { ProfessionalSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/professional.policy';

type CreatePolicyOptions = {
	aiModel: AIModelEnum;
	chatType: ChatTypeEnum;
	planLevel: VendorPlanLevelEnum;
};

type SubscriptionPolicyConstructor = new (
	aiModel: AIModelEnum,
	chatType: ChatTypeEnum,
) => SubscriptionPolicy;

const PLAN_POLICY_MAP: Record<
	VendorPlanLevelEnum,
	SubscriptionPolicyConstructor
> = {
	[VendorPlanLevelEnum.Free]: FreeSubscriptionPolicyValidator,
	[VendorPlanLevelEnum.Essential]: EssentialSubscriptionPolicyValidator,
	[VendorPlanLevelEnum.Professional]: ProfessionalSubscriptionPolicyValidator,
	[VendorPlanLevelEnum.Executive]: ExecutiveSubscriptionPolicyValidator,
};

@Injectable()
export class SubscriptionPolicyFactoryService {
	createPolicy({
		aiModel,
		chatType,
		planLevel,
	}: CreatePolicyOptions): SubscriptionPolicy {
		const planPolicyHandler = PLAN_POLICY_MAP[planLevel];

		if (!planPolicyHandler)
			throw SubscriptionPolicyViolationError.byInvalidSubscription();

		return new planPolicyHandler(aiModel, chatType);
	}
}
