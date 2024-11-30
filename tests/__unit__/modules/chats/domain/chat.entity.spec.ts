import { ChatEntity } from '@/modules/chats/domain/chat.entity';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

import { ChatEntityBuilder } from '#/__unit__/builders/chats/chat.builder';

describe(ChatEntity.name, () => {
	it('should create a new chat', () => {
		const chat = new ChatEntityBuilder()
			.setType(ChatTypeEnum.DraftingLegalDocuments)
			.build();

		expect(chat).toBeDefined();
		expect(chat.getProps().type).toBe('drafting_legal_documents');
		expect(chat.deletedAt).toBe(undefined);
	});

	it('should restore a chat', () => {
		const chat = new ChatEntityBuilder().build();
		const restoredChat = ChatEntity.restore({
			id: chat.id,
			props: chat.getProps(),
			createdAt: chat.createdAt,
			deletedAt: chat.deletedAt,
		});

		expect(restoredChat).toBeDefined();
		expect(restoredChat).toStrictEqual(chat);
	});
});
