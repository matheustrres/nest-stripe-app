import { Invite } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { InviteStatusEnum } from '@/modules/guests/domain/enums/invite-status';
import { InviteEntity } from '@/modules/guests/domain/invite.entity';

export class PrismaInviteMapper implements Mapper<InviteEntity, Invite> {
	toDomain(model: Invite): InviteEntity {
		return InviteEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				ownerId: new EntityCuid(model.ownerId),
				guestId: model.guestId ? new EntityCuid(model.guestId) : null,
				status: model.status as InviteStatusEnum,
			},
			createdAt: model.createdAt,
		});
	}

	toPersist(entity: InviteEntity): Invite {
		const { ownerId, guestId, ...rest } = entity.getProps();

		return {
			id: entity.id.value,
			...rest,
			ownerId: ownerId.value,
			guestId: guestId?.value || null,
			createdAt: entity.createdAt,
			updatedAt: new Date(),
		};
	}
}
