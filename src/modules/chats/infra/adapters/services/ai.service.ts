import { Content, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

import { EnvService } from '@/@core/config/env/env.service';

import {
	AIService,
	GenContentInput,
} from '@/modules/chats/application/services/ai.service';

@Injectable()
export class GeminiAIServiceAdapter implements AIService {
	readonly #generativeAI: GoogleGenerativeAI;

	constructor(private readonly envService: EnvService) {
		const key = this.envService.getKeyOrThrow('GEMINI_API_KEY');

		this.#generativeAI = new GoogleGenerativeAI(key);
	}

	async genContent({
		chatPreviousMessages,
		model,
		prompt,
	}: GenContentInput): Promise<string> {
		const chatHistoryContent: Content[] = chatPreviousMessages
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
		const chat = geminiModel.startChat({
			history: chatHistoryContent,
		});
		const chatHistory = await chat.getHistory();
		const result = await geminiModel.generateContent({
			contents: [
				...chatHistory,
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

		return result.response.text();
	}
}
