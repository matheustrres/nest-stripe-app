import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';

export type GuestEntityProps = {
	ownerId: EntityCuid;
	userId: EntityCuid;
	inviteId: EntityCuid;
};

type GuestEntityConstructorProps = CreateEntityProps<GuestEntityProps>;
type UpdateGuestEntityProps = Partial<GuestEntityProps>;

export class GuestEntity extends Entity<GuestEntityProps> {
	private constructor(props: GuestEntityConstructorProps) {
		super(props);
	}

	static createNew(props: GuestEntityProps): GuestEntity {
		return new GuestEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: GuestEntityConstructorProps): GuestEntity {
		return new GuestEntity(props);
	}

	update(props: UpdateGuestEntityProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
