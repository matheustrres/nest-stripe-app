import { Guest, Invite } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { GuestEntity } from '@/modules/guests/domain/guest.entity';

type MappingOptions = {
	relations?: {
		invite: Invite | null;
	};
};

export class PrismaGuestMapper implements Mapper<GuestEntity, Guest> {
	toDomain(model: Guest, mappingOptions?: MappingOptions): GuestEntity {
		return GuestEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				inviteId: mappingOptions?.relations?.invite
					? new EntityCuid(mappingOptions.relations.invite.id)
					: null,
				ownerId: new EntityCuid(model.ownerId),
				userId: new EntityCuid(model.userId),
			},
			createdAt: model.createdAt,
		});
	}

	toPersist(entity: GuestEntity): Guest {
		const { ownerId, userId } = entity.getProps();

		return {
			id: entity.id.value,
			ownerId: ownerId.value,
			userId: userId.value,
			createdAt: entity.createdAt,
			updatedAt: new Date(),
		};
	}
}
