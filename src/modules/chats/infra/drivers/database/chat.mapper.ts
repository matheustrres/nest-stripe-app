import { Chat } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { ChatEntity } from '@/modules/chats/domain/chat.entity';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

export class PrismaChatMapper implements Mapper<ChatEntity, Chat> {
	toDomain(model: Chat): ChatEntity {
		return ChatEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				ownerId: new EntityCuid(model.ownerId),
				type: model.type as ChatTypeEnum,
				archivedAt: model.archivedAt ?? undefined,
			},
			createdAt: model.createdAt,
			deletedAt: model.deletedAt ?? undefined,
		});
	}

	toPersist(entity: ChatEntity): Chat {
		const { name, ownerId, type, archivedAt } = entity.getProps();

		return {
			id: entity.id.value,
			name,
			ownerId: ownerId.value,
			type,
			createdAt: entity.createdAt,
			updatedAt: new Date(),
			deletedAt: entity.deletedAt ?? null,
			archivedAt: archivedAt ?? null,
		};
	}
}
