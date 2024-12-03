import {
	Content,
	GenerateContentResult,
	GoogleGenerativeAI,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

import { EnvService } from '@/@core/config/env/env.service';

import {
	AIService,
	GenContentInput,
	GenContentOutput,
} from '@/modules/chats/application/services/ai.service';
import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';

@Injectable()
export class GeminiAIServiceAdapter implements AIService {
	readonly #generativeAI: GoogleGenerativeAI;

	constructor(private readonly envService: EnvService) {
		const key = this.envService.getKeyOrThrow('GEMINI_API_KEY');

		this.#generativeAI = new GoogleGenerativeAI(key);
	}

	async estimateTokensUsage(
		model: AIModelEnum,
		prompt: string,
	): Promise<number> {
		const geminiModel = this.#generativeAI.getGenerativeModel({ model });
		const { totalTokens } = await geminiModel.countTokens(prompt);
		return totalTokens;
	}

	async genContent({
		chatPreviousMessages,
		model,
		prompt,
	}: GenContentInput): Promise<GenContentOutput> {
		const chatPreviousHistoryContent: Content[] = chatPreviousMessages
			.flatMap((msg) => {
				const { content, responses } = msg.getProps();
				return [
					{
						role: 'user',
						parts: [{ text: content }],
						createdAt: msg.createdAt,
					},
					...responses.map((res) => ({
						role: 'model',
						parts: [{ text: res.getProps().content }],
						createdAt: res.createdAt,
					})),
				];
			})
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
			.map(({ role, parts }) => ({ role, parts }));

		const geminiModel = this.#generativeAI.getGenerativeModel({
			model,
		});
		const chatSession = geminiModel.startChat({
			history: chatPreviousHistoryContent,
		});
		const chatHistoryContent = await chatSession.getHistory();

		const generatedContentResult: GenerateContentResult =
			await geminiModel.generateContent({
				contents: [
					...chatHistoryContent,
					{
						role: 'user',
						parts: [
							{
								text: prompt,
							},
						],
					},
				],
			});

		const { text, usageMetadata } = generatedContentResult.response;

		return {
			data: text(),
			tokensUsed: usageMetadata!.totalTokenCount,
		};
	}
}
