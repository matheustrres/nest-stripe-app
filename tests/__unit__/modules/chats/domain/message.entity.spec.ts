import { MessageEntity } from '@/modules/chats/domain/message.entity';

import { MessageEntityBuilder } from '#/__unit__/builders/chats/message.builder';

describe(MessageEntity.name, () => {
	it('should create a new message', () => {
		const message = new MessageEntityBuilder()
			.setContent('What is 2 plus 2?')
			.build();

		expect(message).toBeDefined();
		expect(message.getProps().content).toBe('What is 2 plus 2?');
	});

	it('should restore a message', () => {
		const message = new MessageEntityBuilder().build();
		const restoredMessage = MessageEntity.restore({
			id: message.id,
			props: message.getProps(),
			createdAt: message.createdAt,
			deletedAt: message.deletedAt,
		});

		expect(restoredMessage).toBeDefined();
		expect(restoredMessage).toStrictEqual(message);
	});

	it('should update a message', () => {
		const message = new MessageEntityBuilder()
			.setContent('What is 2 plus 2?')
			.build();

		expect(message.getProps().content).toBe('What is 2 plus 2?');

		message.update({
			content: 'What is the best team in the world?',
		});

		expect(message.getProps().content).toBe(
			'What is the best team in the world?',
		);
	});
});
