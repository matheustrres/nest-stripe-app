import { ChatEntity } from '@/modules/chats/domain/chat.entity';

export type ChatHttpResponse = {
	id: string;
	name: string;
	type: string;
	ownerId: string;
	archivedAt?: Date;
	createdAt: Date;
};

export class ChatViewModel {
	static toHttp(chat: ChatEntity): ChatHttpResponse {
		const { name, ownerId, type, archivedAt } = chat.getProps();

		return {
			id: chat.id.value,
			name,
			ownerId: ownerId.value,
			type: type.toString(),
			...(archivedAt && {
				archivedAt,
			}),
			createdAt: chat.createdAt,
		};
	}
}
