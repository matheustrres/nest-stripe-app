import { Either } from '@/@core/domain/logic/either';

export type VendorCustomerType = {
	id: string;
	email: string;
	defaultPaymentMethodId: string | null;
	created: number;
};

export type UpdateCustomerOptions = {
	email: string;
	paymentMethodId: string;
};

export abstract class VendorCustomersResource {
	abstract create(
		email: string,
		paymentMethodId: string,
	): Promise<Either<null, VendorCustomerType>>;
	abstract delete(customerId: string): Promise<void>;
}
