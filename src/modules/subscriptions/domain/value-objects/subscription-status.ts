import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';

export type SubscriptionStatusValueObjectProps = {
	status: SubscriptionStatusEnum;
	readonly createdAt: Date;
};

export class SubscriptionStatusValueObject
	implements SubscriptionStatusValueObjectProps
{
	status!: SubscriptionStatusEnum;
	readonly createdAt!: Date;

	constructor(status: SubscriptionStatusEnum, createdAt: Date) {
		this.status = status;
		this.createdAt = createdAt;
	}

	isActive(): boolean {
		return this.status === SubscriptionStatusEnum.Active;
	}

	isCanceled(): boolean {
		return this.status === SubscriptionStatusEnum.Canceled;
	}

	equalsTo(instance: SubscriptionStatusValueObject): boolean {
		return (
			this.status === instance.status && this.createdAt === instance.createdAt
		);
	}
}
