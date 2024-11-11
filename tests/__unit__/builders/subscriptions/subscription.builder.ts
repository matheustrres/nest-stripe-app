import { SubscriptionStatusValueObjectBuilder } from './value-objects/subscription-status.builder';

import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	SubscriptionEntity,
	SubscriptionEntityProps,
} from '@/modules/subscriptions/domain/subscription.entity';
import { SubscriptionStatusValueObject } from '@/modules/subscriptions/domain/value-objects/subscription-status';

import { FakerLib } from '#/__unit__/!libs/faker';

export class SubscriptionEntityBuilder {
	#props: SubscriptionEntityProps = {
		status: new SubscriptionStatusValueObjectBuilder().build(),
		userId: new EntityCuid(),
		vendorCustomerId: FakerLib.string.uuid(),
		vendorProductId: FakerLib.string.uuid(),
		vendorSubscriptionId: FakerLib.string.uuid(),
	};

	getProps(): SubscriptionEntityProps {
		return this.#props;
	}

	setStatus(status: SubscriptionStatusValueObject): this {
		this.#props.status = status;
		return this;
	}

	setUserId(userId: EntityCuid): this {
		this.#props.userId = userId;
		return this;
	}

	setVendorCustomerId(vendorCustomerId: string): this {
		this.#props.vendorCustomerId = vendorCustomerId;
		return this;
	}

	setVendorProductId(vendorProductId: string): this {
		this.#props.vendorProductId = vendorProductId;
		return this;
	}

	setVendorSubscriptionId(vendorSubscriptionId: string): this {
		this.#props.vendorSubscriptionId = vendorSubscriptionId;
		return this;
	}

	build(): SubscriptionEntity {
		return SubscriptionEntity.createNew(this.#props);
	}
}
