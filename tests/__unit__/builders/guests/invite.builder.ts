import { EntityCuid } from '@/@core/domain/entity-cuid';

import { InviteStatusEnum } from '@/modules/guests/domain/enums/invite-status';
import {
	InviteEntity,
	InviteEntityProps,
} from '@/modules/guests/domain/invite.entity';

export class InviteEntityBuilder {
	#props: InviteEntityProps = {
		expiresAt: new Date(),
		guestId: new EntityCuid(),
		ownerId: new EntityCuid(),
		status: InviteStatusEnum.Pending,
	};

	getProps(): InviteEntityProps {
		return this.#props;
	}

	setExpiresAt(expiresAt: Date): this {
		this.#props.expiresAt = expiresAt;
		return this;
	}

	setGuestId(guestId: EntityCuid): this {
		this.#props.guestId = guestId;
		return this;
	}

	setOwnerId(ownerId: EntityCuid): this {
		this.#props.ownerId = ownerId;
		return this;
	}

	setStatus(status: InviteStatusEnum): this {
		this.#props.status = status;
		return this;
	}

	build(): InviteEntity {
		return InviteEntity.createNew(this.#props);
	}
}
