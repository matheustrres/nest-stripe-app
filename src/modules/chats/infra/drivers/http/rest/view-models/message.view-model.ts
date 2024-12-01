import { MessageEntity } from '@/modules/chats/domain/message.entity';

export type MessageHttpResponse = {
	id: string;
	chatId: string;
	content: string;
	createdAt: Date;
};

export class MessageViewModel {
	static toHttp(message: MessageEntity): MessageHttpResponse {
		const { chatId, content } = message.getProps();

		return {
			id: message.id.value,
			chatId: chatId.value,
			content,
			createdAt: message.createdAt,
		};
	}
}
