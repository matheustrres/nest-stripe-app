import { faker } from '@faker-js/faker';

import { VendorPaymentMethodBuilder } from './vendor-payment-method.builder';

import { VendorCustomerType } from '@/modules/subscriptions/application/clients/payments/payments.client';

export class VendorCustomerBuilder {
	#props: VendorCustomerType = {
		id: faker.string.ulid(),
		email: faker.internet.email(),
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
