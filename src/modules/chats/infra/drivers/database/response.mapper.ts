import { Response } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { AiModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ResponseEntity } from '@/modules/chats/domain/response.entity';

export class PrismaResponseMapper implements Mapper<ResponseEntity, Response> {
	toDomain(model: Response): ResponseEntity {
		return ResponseEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				messageId: new EntityCuid(model.messageId),
				model: model.model as AiModelEnum,
			},
			createdAt: model.createdAt,
		});
	}

	toPersist(entity: ResponseEntity): Response {
		const { content, messageId, model } = entity.getProps();

		return {
			id: entity.id.value,
			messageId: messageId.value,
			model: model.toString(),
			content,
			createdAt: entity.createdAt,
			updatedAt: new Date(),
		};
	}
}
