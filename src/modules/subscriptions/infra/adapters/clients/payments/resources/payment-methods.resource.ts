import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { Either, left, right } from '@/@core/domain/logic/either';

import {
	VendorCardCVCTypeEnum,
	VendorCardFundingTypeEnum,
	VendorPaymentMethodOptionsType,
	VendorPaymentMethodsResource,
	VendorPaymentMethodType,
	VendorPaymentMethodTypeEnum,
	VendorPaymentMethodWithBoletoType,
	VendorPaymentMethodWithCardType,
} from '@/modules/subscriptions/application/clients/payments/payments.client';

type PaymentMethodBuildersMap = Record<
	string,
	(data: any) => VendorPaymentMethodOptionsType
>;

@Injectable()
export class StripePaymentMethodsResourceAdapter
	implements VendorPaymentMethodsResource
{
	constructor(private readonly stripeClient: Stripe) {}

	async attach(paymentMethodId: string, customerId: string): Promise<void> {
		await this.stripeClient.paymentMethods.attach(paymentMethodId, {
			customer: customerId,
		});
	}

	async findById(id: string): Promise<Either<null, VendorPaymentMethodType>> {
		const stripePaymentMethod =
			await this.stripeClient.paymentMethods.retrieve(id);
		if (!stripePaymentMethod) return left(null);
		return right(this.#buildVendorPaymentMethod(stripePaymentMethod));
	}

	#buildVendorPaymentMethod(
		stripePaymentMethod: Stripe.PaymentMethod,
	): VendorPaymentMethodType {
		const { type, customer } = stripePaymentMethod;
		const paymentMethodBuildersMap: PaymentMethodBuildersMap = {
			[VendorPaymentMethodTypeEnum.Boleto]: this.#buildBoletoPaymentMethod,
			[VendorPaymentMethodTypeEnum.Card]: this.#buildCardPaymentMethod,
		};

		const paymentMethod = paymentMethodBuildersMap[type];
		if (!paymentMethod) {
			throw new BadRequestException(
				`Unsupported payment method type "${type}".`,
			);
		}
		const paymentMethodOption = paymentMethod.call(
			this,
			stripePaymentMethod[type],
		);

		return {
			...stripePaymentMethod,
			customer: customer?.toString() || null,
			...paymentMethodOption,
		};
	}

	#buildBoletoPaymentMethod(
		boleto?: Stripe.PaymentMethod.Boleto,
	): VendorPaymentMethodWithBoletoType {
		return {
			type: VendorPaymentMethodTypeEnum.Boleto,
			boleto: {
				taxId: boleto?.tax_id,
			},
		};
	}

	#buildCardPaymentMethod(
		card?: Stripe.PaymentMethod.Card,
	): VendorPaymentMethodWithCardType {
		return {
			type: VendorPaymentMethodTypeEnum.Card,
			card: {
				...card,
				country: card?.country || null,
				cvcCheck: this.#mapCardCVCCheckType(card?.checks?.cvc_check),
				funding: this.#mapCardFundingType(card?.funding),
			},
		};
	}

	#mapCardCVCCheckType(cvcCheck?: string | null): VendorCardCVCTypeEnum | null {
		if (!cvcCheck) return null;
		/**
		 * @see {@link https://docs.stripe.com/api/external_account_cards/object}
		 */
		return (
			{
				pass: VendorCardCVCTypeEnum.Pass,
				fail: VendorCardCVCTypeEnum.Fail,
				unavailable: VendorCardCVCTypeEnum.Unavailable,
				unchecked: VendorCardCVCTypeEnum.Unchecked,
			}[cvcCheck] || null
		);
	}

	#mapCardFundingType(funding?: string): VendorCardFundingTypeEnum {
		if (!funding) return VendorCardFundingTypeEnum.Unknown;
		/**
		 * @see {@link https://docs.stripe.com/api/cards/object#card_object-funding}
		 */
		return (
			{
				credit: VendorCardFundingTypeEnum.Credit,
				debit: VendorCardFundingTypeEnum.Debit,
				prepaid: VendorCardFundingTypeEnum.Prepaid,
				unknown: VendorCardFundingTypeEnum.Unknown,
			}[funding] || VendorCardFundingTypeEnum.Unknown
		);
	}
}
