import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import {
	SubscriptionStatusValueObject,
	SubscriptionStatusValueObjectProps,
} from '@/modules/subscriptions/domain/value-objects/subscription-status';

import { FakerLib } from '#/__unit__/!libs/faker';

export class SubscriptionStatusValueObjectBuilder {
	#props: SubscriptionStatusValueObjectProps = {
		status: SubscriptionStatusEnum.Active,
		createdAt: new Date(),
		vendorSubscriptionId: FakerLib.string.uuid(),
	};

	getProps(): SubscriptionStatusValueObjectProps {
		return this.#props;
	}

	setStatus(status: SubscriptionStatusEnum): this {
		this.#props.status = status;
		return this;
	}

	setVendorSubscriptionId(vendorSubscriptionId: string): this {
		this.#props.vendorSubscriptionId = vendorSubscriptionId;
		return this;
	}

	build(): SubscriptionStatusValueObject {
		const { createdAt, status, vendorSubscriptionId } = this.getProps();

		return new SubscriptionStatusValueObject(
			vendorSubscriptionId,
			status,
			createdAt,
		);
	}
}
