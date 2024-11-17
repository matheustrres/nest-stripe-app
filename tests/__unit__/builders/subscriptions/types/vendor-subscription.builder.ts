import { VendorCustomerBuilder } from './vendor-customer.builder';

import {
	VendorSubscriptionStatusEnum,
	VendorSubscriptionType,
} from '@/modules/subscriptions/application/clients/payments/payments.client';

import { FakerLib } from '#/__unit__/!libs/faker';

export class VendorSubscriptionBuilder {
	#props: VendorSubscriptionType = {
		id: FakerLib.string.ulid(),
		cancelAt: Date.now(),
		cancelAtPeriodEnd: FakerLib.datatype.boolean(),
		currency: 'US',
		currentPeriodEnd: Date.now(),
		currentPeriodStart: Date.now(),
		latestInvoice: 'in_1MowQWLkdIwHu7ixuzkSPfKd',
		status: VendorSubscriptionStatusEnum.Active,
		customer: new VendorCustomerBuilder().getProps().id,
		created: Date.now(),
	};

	getProps(): VendorSubscriptionType {
		return this.#props;
	}

	setId(id: string): this {
		this.#props.id = id;
		return this;
	}

	setCancelAt(cancelAt: number): this {
		this.#props.cancelAt = cancelAt;
		return this;
	}

	setCancelAtPeriodEnd(cancelAtPeriodEnd: boolean): this {
		this.#props.cancelAtPeriodEnd = cancelAtPeriodEnd;
		return this;
	}

	setCurrency(currency: string): this {
		this.#props.currency = currency;
		return this;
	}

	setCurrentPeriodStart(start: number): this {
		this.#props.currentPeriodStart = start;
		return this;
	}

	setCurrentPeriodEnd(end: number): this {
		this.#props.currentPeriodEnd = end;
		return this;
	}

	setLatestInvoice(latestInvoice: string): this {
		this.#props.latestInvoice = latestInvoice;
		return this;
	}

	setStatus(status: VendorSubscriptionStatusEnum): this {
		this.#props.status = status;
		return this;
	}

	setCustomerId(customerId: string): this {
		this.#props.customer = customerId;
		return this;
	}

	setCreated(created: number): this {
		this.#props.created = created;
		return this;
	}

	build(): VendorSubscriptionType {
		return this.#props;
	}
}
