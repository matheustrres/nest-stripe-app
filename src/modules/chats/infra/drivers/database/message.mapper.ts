import { Message } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { MessageEntity } from '@/modules/chats/domain/message.entity';

export class PrismaMessageMapper implements Mapper<MessageEntity, Message> {
	toDomain(model: Message): MessageEntity {
		return MessageEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				chatId: new EntityCuid(model.chatId),
			},
			createdAt: model.createdAt,
			deletedAt: model.deletedAt ?? undefined,
		});
	}

	toPersist(entity: MessageEntity): Message {
		const { chatId, ...rest } = entity.getProps();

		return {
			id: entity.id.value,
			...rest,
			chatId: chatId.value,
			createdAt: entity.createdAt,
			deletedAt: entity.deletedAt ?? null,
			updatedAt: new Date(),
		};
	}
}
