import {
	VendorCardCVCTypeEnum,
	VendorCardFundingTypeEnum,
	VendorPaymentMethodType,
	VendorPaymentMethodTypeEnum,
} from '@/modules/subscriptions/application/clients/payments/payments.client';

import { FakerLib } from '#/__unit__/!libs/faker';

export class VendorPaymentMethodBuilder {
	#props: VendorPaymentMethodType = {
		id: FakerLib.string.ulid(),
		created: Date.now(),
		type: VendorPaymentMethodTypeEnum.Card,
		card: {
			country: 'US',
			cvcCheck: VendorCardCVCTypeEnum.Pass,
			funding: VendorCardFundingTypeEnum.Credit,
			brand: 'visa',
			expMonth: 4,
			expYear: 2024,
			last4digits: '1234',
		},
		customer: FakerLib.string.ulid(),
	};

	getProps(): VendorPaymentMethodType {
		return this.#props;
	}

	setId(id: string): this {
		this.#props.id = id;
		return this;
	}

	setCreated(created: number): this {
		this.#props.created = created;
		return this;
	}

	setCustomer(customerId: string): this {
		this.#props.customer = customerId;
		return this;
	}

	build(): VendorPaymentMethodType {
		return this.#props;
	}
}
