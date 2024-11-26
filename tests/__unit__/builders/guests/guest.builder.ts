import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	GuestEntity,
	GuestEntityProps,
} from '@/modules/guests/domain/guest.entity';

export class GuestEntityBuilder {
	#props: GuestEntityProps = {
		ownerId: new EntityCuid(),
		userId: new EntityCuid(),
		inviteId: new EntityCuid(),
	};

	getProps(): GuestEntityProps {
		return this.#props;
	}

	setOwnerId(ownerId: EntityCuid): this {
		this.#props.ownerId = ownerId;
		return this;
	}

	setUserId(userId: EntityCuid): this {
		this.#props.userId = userId;
		return this;
	}

	setInviteId(inviteId: EntityCuid): this {
		this.#props.inviteId = inviteId;
		return this;
	}

	build(): GuestEntity {
		return GuestEntity.createNew(this.#props);
	}
}
