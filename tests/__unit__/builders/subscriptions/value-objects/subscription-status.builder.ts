import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import {
	SubscriptionStatusValueObject,
	SubscriptionStatusValueObjectProps,
} from '@/modules/subscriptions/domain/value-objects/subscription-status';

export class SubscriptionStatusValueObjectBuilder {
	#props: SubscriptionStatusValueObjectProps = {
		status: SubscriptionStatusEnum.Active,
		createdAt: new Date(),
	};

	getProps(): SubscriptionStatusValueObjectProps {
		return this.#props;
	}

	setStatus(status: SubscriptionStatusEnum): this {
		this.#props.status = status;
		return this;
	}

	build(): SubscriptionStatusValueObject {
		const { createdAt, status } = this.getProps();

		return new SubscriptionStatusValueObject(status, createdAt);
	}
}
