import { Message, Response } from '@prisma/client';

import { PrismaResponseMapper } from './response.mapper';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { MessageEntity } from '@/modules/chats/domain/message.entity';

type MappingOptions = {
	relations?: {
		responses: Response[];
	};
};

export class PrismaMessageMapper implements Mapper<MessageEntity, Message> {
	toDomain(model: Message, mappingOptions?: MappingOptions): MessageEntity {
		const responsesToMap = mappingOptions?.relations?.responses;

		return MessageEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				...(responsesToMap?.length && {
					responses: responsesToMap.map(new PrismaResponseMapper().toDomain),
				}),
				chatId: new EntityCuid(model.chatId),
			},
			createdAt: model.createdAt,
			deletedAt: model.deletedAt ?? undefined,
		});
	}

	toPersist(entity: MessageEntity): Message {
		const { chatId, content } = entity.getProps();

		return {
			id: entity.id.value,
			chatId: chatId.value,
			content,
			createdAt: entity.createdAt,
			deletedAt: entity.deletedAt ?? null,
			updatedAt: new Date(),
		};
	}
}
