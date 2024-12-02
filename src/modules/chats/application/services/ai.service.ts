import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { MessageEntity } from '@/modules/chats/domain/message.entity';

export type GenContentInput = {
	chatPreviousMessages: MessageEntity[];
	model: AIModelEnum;
	prompt: string;
};

export abstract class AIService {
	abstract genContent(input: GenContentInput): Promise<string>;
}
