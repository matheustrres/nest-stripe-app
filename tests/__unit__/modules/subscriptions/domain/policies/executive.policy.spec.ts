import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { ExecutiveSubscriptionPolicyValidator } from '@/modules/subscriptions/domain/policies/validators/executive.policy';

describe(ExecutiveSubscriptionPolicyValidator.name, () => {
	describe('it should pass policy validation', () => {
		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.ConsumerLaw} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.ConsumerLaw,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.QuickSearch} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.QuickSearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.LegalResearch} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.LegalResearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_0Pro} AI model with ${ChatTypeEnum.DraftingLegalDocuments} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_0Pro,
				ChatTypeEnum.DraftingLegalDocuments,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.ConsumerLaw} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Flash,
				ChatTypeEnum.ConsumerLaw,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.QuickSearch} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Flash,
				ChatTypeEnum.QuickSearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.LegalResearch} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Flash,
				ChatTypeEnum.LegalResearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Flash} AI model with ${ChatTypeEnum.DraftingLegalDocuments} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Flash,
				ChatTypeEnum.DraftingLegalDocuments,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Pro} AI model with ${ChatTypeEnum.ConsumerLaw} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Pro,
				ChatTypeEnum.ConsumerLaw,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Pro} AI model with ${ChatTypeEnum.QuickSearch} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Pro,
				ChatTypeEnum.QuickSearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Pro} AI model with ${ChatTypeEnum.LegalResearch} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Pro,
				ChatTypeEnum.LegalResearch,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});

		it(`when using allowed ${AIModelEnum.Gemini1_5Pro} AI model with ${ChatTypeEnum.DraftingLegalDocuments} chat type resources`, () => {
			const policyValidationResult = new ExecutiveSubscriptionPolicyValidator(
				AIModelEnum.Gemini1_5Pro,
				ChatTypeEnum.DraftingLegalDocuments,
			).validate();

			expect(policyValidationResult.isRight()).toBe(true);
			expect(policyValidationResult.value).toBe(void 0);
		});
	});
});
