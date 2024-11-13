import { Either } from '@/@core/domain/logic/either';

export enum VendorCardFundingTypeEnum {
	Credit = 'credit',
	Debit = 'debit',
	Prepaid = 'prepaid',
	Unknown = 'unknown',
}

export type VendorCardType = {
	brand?: string;
	country: string | null;
	expMonth?: number;
	expYear?: number;
	funding: VendorCardFundingTypeEnum | undefined;
	last4digits?: string;
	cvcCheck: string | null;
};

export type VendorPaymentMethodType = {
	id: string;
	card: VendorCardType;
	customer: string | null;
	type: string;
	created: number;
};

export abstract class VendorPaymentMethodsResource {
	abstract attach(paymentMethodId: string, customerId: string): Promise<void>;
	abstract findById(id: string): Promise<Either<null, VendorPaymentMethodType>>;
}
