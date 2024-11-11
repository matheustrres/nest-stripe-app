import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';

export type SubscriptionStatusValueObjectProps = {
	vendorSubscriptionId: string;
	status: SubscriptionStatusEnum;
	readonly createdAt: Date;
};

export class SubscriptionStatusValueObject
	implements SubscriptionStatusValueObjectProps
{
	vendorSubscriptionId!: string;
	status!: SubscriptionStatusEnum;
	readonly createdAt!: Date;

	constructor(
		vendorSubscriptionId: string,
		status: SubscriptionStatusEnum,
		createdAt: Date,
	) {
		this.vendorSubscriptionId = vendorSubscriptionId;
		this.status = status;
		this.createdAt = createdAt;
	}

	isActive(): boolean {
		return this.status === SubscriptionStatusEnum.Active;
	}

	equalsTo(instance: SubscriptionStatusValueObject): boolean {
		return (
			this.status === instance.status &&
			this.vendorSubscriptionId === instance.vendorSubscriptionId &&
			this.createdAt === instance.createdAt
		);
	}
}
