import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { SubscriptionPolicyViolationError } from '@/modules/subscriptions/domain/policies/errors/subscription-policy-violation.error';
import { ProfessionalSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/professional.policy';

describe(ProfessionalSubscriptionPolicyValidator.name, () => {
	describe('it should return a SubscriptionPolicyViolationError', () => {
		it(`when using forbidden ${AIModelEnum.Gemini1_5Pro} AI model resource`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_5Pro,
					ChatTypeEnum.QuickSearch,
				).validate();

			expect(policyValidationResult.isLeft()).toBe(true);
			expect(policyValidationResult.value).toEqual(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Professional,
				),
			);
		});

		it(`when using forbidden ${ChatTypeEnum.DraftingLegalDocuments} chat type resource`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_5Pro,
					ChatTypeEnum.DraftingLegalDocuments,
				).validate();

			expect(policyValidationResult.isLeft()).toBe(true);
			expect(policyValidationResult.value).toEqual(
				SubscriptionPolicyViolationError.forbiddenResourceForPlan(
					VendorPlanLevelEnum.Professional,
				),
			);
		});
	});

	describe('it should pass policy validation', () => {
		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.ConsumerLaw} chat type resources`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_0Pro,
					ChatTypeEnum.ConsumerLaw,
				).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.QuickSearch} chat type resources`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_0Pro,
					ChatTypeEnum.QuickSearch,
				).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.LegalResearch} chat type resources`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_0Pro,
					ChatTypeEnum.LegalResearch,
				).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.ConsumerLaw} chat type resources`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_5Flash,
					ChatTypeEnum.ConsumerLaw,
				).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.QuickSearch} chat type resources`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_5Flash,
					ChatTypeEnum.QuickSearch,
				).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.LegalResearch} chat type resources`, () => {
			const policyValidationResult =
				new ProfessionalSubscriptionPolicyValidator(
					AIModelEnum.Gemini1_5Flash,
					ChatTypeEnum.LegalResearch,
				).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});
	});
});
