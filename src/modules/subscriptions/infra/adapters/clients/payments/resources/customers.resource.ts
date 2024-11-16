import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { Either, left, right } from '@/@core/domain/logic/either';

import {
	VendorCustomerType,
	VendorCustomersResource,
} from '@/modules/subscriptions/application/clients/payments/payments.client';

@Injectable()
export class StripeCustomersResourceAdapter implements VendorCustomersResource {
	constructor(private readonly stripeClient: Stripe) {}

	async create(
		email: string,
		paymentMethodId: string,
	): Promise<Either<null, VendorCustomerType>> {
		const customer = await this.stripeClient.customers.create({
			email,
			payment_method: paymentMethodId,
			invoice_settings: {
				default_payment_method: paymentMethodId,
			},
		});
		if (!customer) return left(null);
		return right(this.#buildVendorCustomer(customer));
	}

	async delete(customerId: string): Promise<void> {
		await this.stripeClient.customers.del(customerId);
	}

	#buildVendorCustomer(customer: Stripe.Customer): VendorCustomerType {
		return {
			id: customer.id,
			email: customer.email as string,
			defaultPaymentMethodId: customer.invoice_settings
				.default_payment_method as string,
			created: customer.created,
		};
	}
}
