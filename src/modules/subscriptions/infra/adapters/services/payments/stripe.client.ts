import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { StripeCustomersResourceAdapter } from './resources/customers.resource';
import { StripePaymentMethodsResourceAdapter } from './resources/payment-methods.resource';
import { StripeSubscriptionsResourceAdapter } from './resources/subscriptions.resource';

import {
	VendorCustomersResource,
	VendorPaymentMethodsResource,
	VendorPaymentsClient,
	VendorSubscriptionsResource,
} from '@/modules/subscriptions/application/clients/payments/payments.client';

@Injectable()
export class StripePaymentsClientAdapter implements VendorPaymentsClient {
	readonly #stripeClient: Stripe;

	customers: VendorCustomersResource;
	paymentMethods: VendorPaymentMethodsResource;
	subscriptions: VendorSubscriptionsResource;

	constructor(@InjectStripeClient() stripeClient: Stripe) {
		this.#stripeClient = stripeClient;

		this.customers = new StripeCustomersResourceAdapter(this.#stripeClient);
		this.paymentMethods = new StripePaymentMethodsResourceAdapter(
			this.#stripeClient,
		);
		this.subscriptions = new StripeSubscriptionsResourceAdapter(
			this.#stripeClient,
		);
	}
}
