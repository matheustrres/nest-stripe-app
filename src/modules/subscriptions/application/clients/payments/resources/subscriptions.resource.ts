import { Either } from '@/@core/domain/logic/either';

export type VendorPlanType = {
	id: string;
	productId?: string | null;
	interval: string;
	currency: string;
	amount: number | null;
	intervalCount?: number;
};

export enum VendorSubscriptionStatusEnum {
	Active = 'active',
	Canceled = 'canceled',
	Incomplete = 'incomplete',
	IncompleteExpired = 'incompleteExpired',
	PastDue = 'pastDue',
	Paused = 'paused',
	Trialing = 'trialing',
	Unpaid = 'unpaid',
}

export type VendorSubscriptionType = {
	id: string;
	customer: string;
	currentPeriodEnd: number;
	currentPeriodStart: number;
	cancelAtPeriodEnd: boolean;
	currency: string;
	latestInvoice: string | null;
	status: VendorSubscriptionStatusEnum;
	cancelAt: number | null;
	plan?: VendorPlanType;
	created: number;
};

export abstract class VendorSubscriptionsResource {
	abstract create(
		customerId: string,
		priceId: string,
		paymentMethodId: string,
	): Promise<Either<null, VendorSubscriptionType>>;
}
