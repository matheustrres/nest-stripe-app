import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { MessageEntity } from '@/modules/chats/domain/message.entity';

export type GenContentInput = {
	chatPreviousMessages: MessageEntity[];
	model: AIModelEnum;
	prompt: string;
};

export type GenContentOutput = {
	data: string;
	tokensUsed: number;
};

export abstract class AIService {
	abstract estimateTokensUsage(
		model: AIModelEnum,
		prompt: string,
	): Promise<number>;
	abstract genContent(input: GenContentInput): Promise<GenContentOutput>;
}
