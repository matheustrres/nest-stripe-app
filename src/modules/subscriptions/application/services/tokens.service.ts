import { Injectable } from '@nestjs/common';

import { AIModelSpecs } from '@/@core/domain/constants/ai-model-specs';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';

@Injectable()
export class SubscriptionTokensService {
	readonly #averageTokenChars = 4;

	#getAvgTokensForModel(model: AIModelEnum): number {
		const average = AIModelSpecs[model];
		return average.tokensPerRequest;
	}

	estimateTokensUsage(input: string, model: AIModelEnum): number {
		const inputLength = input.length;
		const avgTokensPerRequest = this.#getAvgTokensForModel(model);
		const inputTokenCount = Math.ceil(inputLength / this.#averageTokenChars);

		const estimative = inputTokenCount + avgTokensPerRequest;

		return estimative;
	}
}
