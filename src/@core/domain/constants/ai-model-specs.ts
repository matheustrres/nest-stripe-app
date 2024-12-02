import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';

type AIModelSpecsType = {
	tokensPerRequest: number;
};

export const AIModelSpecs: Record<AIModelEnum, AIModelSpecsType> = {
	[AIModelEnum.Gemini1_5Pro]: {
		tokensPerRequest: 20,
	},
	[AIModelEnum.Gemini1_5Flash]: {
		tokensPerRequest: 10,
	},
	[AIModelEnum.Gemini1_0Pro]: {
		tokensPerRequest: 5,
	},
} as const;
