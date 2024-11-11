import { SubscriptionStatusValueObject } from './value-objects/subscription-status';

import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';

export type SubscriptionEntityProps = {
	userId: EntityCuid;
	vendorSubscriptionId: string;
	vendorCustomerId: string;
	vendorProductId: string;
	status: SubscriptionStatusValueObject;
};

type SubscriptionEntityConstructorProps =
	CreateEntityProps<SubscriptionEntityProps>;
type UpdateSubscriptionEntityProps = Partial<SubscriptionEntityProps>;

export class SubscriptionEntity extends Entity<SubscriptionEntityProps> {
	private constructor(props: SubscriptionEntityConstructorProps) {
		super(props);
	}

	static createNew(props: SubscriptionEntityProps): SubscriptionEntity {
		return new SubscriptionEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(
		props: SubscriptionEntityConstructorProps,
	): SubscriptionEntity {
		return new SubscriptionEntity(props);
	}

	update(props: UpdateSubscriptionEntityProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
