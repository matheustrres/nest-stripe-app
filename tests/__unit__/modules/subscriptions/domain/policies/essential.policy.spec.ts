import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionPolicyViolationError } from '@/modules/subscriptions/domain/policies/errors/subscription-policy-violation.error';
import { EssentialSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/essential.policy';

describe(EssentialSubscriptionPolicyValidator.name, () => {
	describe('it should return a SubscriptionPolicyViolationError', () => {
		it(`when using forbidden ${AIModelEnum.Gemini1_5Flash} AI model resource`, () => {
			const policyValidationResult = new EssentialSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Flash,
				ChatTypeEnum.QuickSearch,
			).validate();

			expect(policyValidationResult.isLeft()).toBe(true);
			expect(policyValidationResult.value).toEqual(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Essential,
				),
			);
		});

		it(`when using forbidden ${AIModelEnum.Gemini1_5Pro} AI model resource`, () => {
			const policyValidationResult = new EssentialSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Pro,
				ChatTypeEnum.QuickSearch,
			).validate();

			expect(policyValidationResult.isLeft()).toBe(true);
			expect(policyValidationResult.value).toEqual(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Essential,
				),
			);
		});

		it(`when using forbidden ${ChatTypeEnum.DraftingLegalDocuments} chat type resource`, () => {
			const policyValidationResult = new EssentialSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.DraftingLegalDocuments,
			).validate();

			expect(policyValidationResult.isLeft()).toBe(true);
			expect(policyValidationResult.value).toEqual(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Essential,
				),
			);
		});

		it(`when using forbidden ${ChatTypeEnum.LegalResearch} chat type resource`, () => {
			const policyValidationResult = new EssentialSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.LegalResearch,
			).validate();

			expect(policyValidationResult.isLeft()).toBe(true);
			expect(policyValidationResult.value).toEqual(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Essential,
				),
			);
		});
	});

	describe('it should pass policy validation', () => {
		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.QuickSearch} resources`, () => {
			const policyValidationResult = new EssentialSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.QuickSearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.ConsumerLaw} resources`, () => {
			const policyValidationResult = new EssentialSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.ConsumerLaw,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});
	});
});
