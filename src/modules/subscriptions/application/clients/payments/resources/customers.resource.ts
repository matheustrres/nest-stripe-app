import { Either } from '@/@core/domain/logic/either';

export type VendorCustomer = {
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
	): Promise<Either<null, VendorCustomer>>;
	abstract delete(customerId: string): Promise<void>;
}
