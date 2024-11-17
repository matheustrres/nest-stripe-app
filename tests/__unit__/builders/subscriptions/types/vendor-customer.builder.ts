import { VendorPaymentMethodBuilder } from './vendor-payment-method.builder';

import { VendorCustomerType } from '@/modules/subscriptions/application/clients/payments/payments.client';

import { FakerLib } from '#/__unit__/!libs/faker';

export class VendorCustomerBuilder {
	#props: VendorCustomerType = {
		id: FakerLib.string.ulid(),
		email: FakerLib.internet.email(),
		defaultPaymentMethodId: new VendorPaymentMethodBuilder().getProps().id,
		created: Date.now(),
	};

	getProps(): VendorCustomerType {
		return this.#props;
	}

	setId(id: string): this {
		this.#props.id = id;
		return this;
	}

	setEmail(email: string): this {
		this.#props.email = email;
		return this;
	}

	setDefaultPaymentMethodId(defaultPaymentMethodId: string): this {
		this.#props.defaultPaymentMethodId = defaultPaymentMethodId;
		return this;
	}

	setCreated(created: number): this {
		this.#props.created = created;
		return this;
	}

	build(): VendorCustomerType {
		return this.#props;
	}
}
