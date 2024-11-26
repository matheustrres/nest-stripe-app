import { InviteStatusEnum } from './enums/invite-status';

import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';

export type InviteEntityProps = {
	expiresAt: Date;
	status: InviteStatusEnum;
	ownerId: EntityCuid;
	guestId?: EntityCuid;
};

type InviteEntityConstructorProps = CreateEntityProps<InviteEntityProps>;
type UpdateInviteEntityProps = Partial<InviteEntityProps>;

export class InviteEntity extends Entity<InviteEntityProps> {
	private constructor(props: InviteEntityConstructorProps) {
		super(props);
	}

	static createNew(props: InviteEntityProps): InviteEntity {
		return new InviteEntity({
			id: new EntityCuid(),
			props: {
				...props,
				status: InviteStatusEnum.Pending,
			},
			createdAt: new Date(),
		});
	}

	static restore(props: InviteEntityConstructorProps): InviteEntity {
		return new InviteEntity(props);
	}

	update(props: UpdateInviteEntityProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}

	acceptInvite(): void {
		this.update({
			status: InviteStatusEnum.Accepted,
		});
	}

	rejectInvite(): void {
		this.update({
			status: InviteStatusEnum.Rejected,
		});
	}
}
