import { Injectable } from '@nestjs/common';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';

@Injectable()
export class SubscriptionTokensService {
	readonly #averageTokensForChars = 4; // 1 token ≈ 4 chars
	readonly #averageWordsPerToken = 0.75; // 100 tokens ≈ 75 words (average)

	readonly #modelAverageTokensRequiredPerRequest: Record<AIModelEnum, number> =
		{
			[AIModelEnum.Gemini1_5Pro]: 710,
			[AIModelEnum.Gemini1_5Flash]: 350,
			[AIModelEnum.Gemini1_0Pro]: 200,
		};
	readonly #tokensValueForModel: Record<AIModelEnum, number> = {
		[AIModelEnum.Gemini1_5Pro]: 1,
		[AIModelEnum.Gemini1_5Flash]: 2,
		[AIModelEnum.Gemini1_0Pro]: 3,
	};

	calculateTokensUsage(tokens: number, model: AIModelEnum): number {
		const tokensCostFactor = this.#tokensValueForModel[model];
		const amplificationFactor = 1.095;

		const totalCharsEstimate = tokens * this.#averageTokensForChars;
		const totalWordsEstimate = tokens * this.#averageWordsPerToken;

		const adjustedTokensEstimate =
			(totalCharsEstimate / this.#averageTokensForChars +
				totalWordsEstimate / this.#averageWordsPerToken) /
			1.135;

		const estimationWithAmplification = Math.hypot(
			adjustedTokensEstimate,
			tokensCostFactor,
			amplificationFactor,
		);

		return Math.ceil(estimationWithAmplification * amplificationFactor);
	}

	getModelAvgTokensPerRequest(model: AIModelEnum): number {
		return this.#modelAverageTokensRequiredPerRequest[model];
	}
}
