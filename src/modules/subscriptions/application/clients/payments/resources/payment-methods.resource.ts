import { Either } from '@/@core/domain/logic/either';

export enum VendorCardFundingTypeEnum {
	Credit = 'credit',
	Debit = 'debit',
	Prepaid = 'prepaid',
	Unknown = 'unknown',
}

export enum VendorCardCVCTypeEnum {
	Fail = 'fail',
	Pass = 'pass',
	Unavailable = 'unavailable',
	Unchecked = 'unchecked',
}

export type VendorCardType = {
	brand?: string;
	country: string | null;
	expMonth?: number;
	expYear?: number;
	funding?: VendorCardFundingTypeEnum;
	last4digits?: string;
	cvcCheck: VendorCardCVCTypeEnum | null;
};

export type VendorBoletoType = {
	taxId?: string;
};

export enum VendorPaymentMethodTypeEnum {
	Card = 'card',
	Boleto = 'boleto',
}

export type VendorPaymentMethodWithCardType = {
	type: VendorPaymentMethodTypeEnum.Card;
	card: VendorCardType;
};
export type VendorPaymentMethodWithBoletoType = {
	type: VendorPaymentMethodTypeEnum.Boleto;
	boleto: VendorBoletoType;
};

export type VendorPaymentMethodOptionsType =
	| VendorPaymentMethodWithCardType
	| VendorPaymentMethodWithBoletoType;

export type VendorPaymentMethodType = {
	id: string;
	customer: string | null;
	created: number;
} & VendorPaymentMethodOptionsType;

export abstract class VendorPaymentMethodsResource {
	abstract attach(paymentMethodId: string, customerId: string): Promise<void>;
	abstract findById(id: string): Promise<Either<null, VendorPaymentMethodType>>;
}
