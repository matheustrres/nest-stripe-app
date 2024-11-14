import { Either } from '@/@core/domain/logic/either';

export type VendorPlanType = {
	id: string;
	productId?: string | null;
	interval: string;
	currency: string;
	amount: number | null;
	intervalCount?: number;
};

export type VendorSubscriptionType = {
	id: string;
	currentPeriodEnd: number;
	currentPeriodStart: number;
	cancelAtPeriodEnd: boolean;
	currency: string;
	latestInvoice: string | null;
	status: string;
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
