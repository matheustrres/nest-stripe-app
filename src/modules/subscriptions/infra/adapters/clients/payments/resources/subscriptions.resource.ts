import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { Either, left, right } from '@/@core/domain/logic/either';

import {
	VendorPlanType,
	VendorSubscriptionsResource,
	VendorSubscriptionStatusEnum,
	VendorSubscriptionType,
} from '@/modules/subscriptions/application/clients/payments/payments.client';

@Injectable()
export class StripeSubscriptionsResourceAdapter
	implements VendorSubscriptionsResource
{
	constructor(private readonly stripeClient: Stripe) {}

	async cancel(
		vendorSubscriptionId: string,
	): Promise<Either<null, VendorSubscriptionType>> {
		const stripeCanceledSubscription = await this.stripeClient.subscriptions
			.cancel(vendorSubscriptionId, {
				cancellation_details: {
					comment: 'Customer request via /subscriptions/cancel',
				},
				prorate: false,
			})
			.catch(() => null);
		if (!stripeCanceledSubscription) return left(null);
		return right(this.#buildVendorSubscription(stripeCanceledSubscription));
	}

	async create(
		customerId: string,
		priceId: string,
		paymentMethodId: string,
	): Promise<Either<null, VendorSubscriptionType>> {
		const stripeSubscription = await this.stripeClient.subscriptions
			.create({
				customer: customerId,
				items: [
					{
						price: priceId,
					},
				],
				default_payment_method: paymentMethodId,
			})
			.catch(() => null);
		if (!stripeSubscription) return left(null);
		return right(this.#buildVendorSubscription(stripeSubscription));
	}

	async findById(id: string): Promise<Either<null, VendorSubscriptionType>> {
		const stripeSubscription = await this.stripeClient.subscriptions
			.retrieve(id)
			.catch(() => null);
		if (!stripeSubscription) return left(null);
		return right(this.#buildVendorSubscription(stripeSubscription));
	}

	#buildVendorSubscription(
		stripeSubscription: Stripe.Subscription,
	): VendorSubscriptionType {
		const subscriptionPlan = stripeSubscription.items.data[0]?.plan;
		stripeSubscription.status;

		return {
			...stripeSubscription,
			...(subscriptionPlan && {
				plan: this.#formatSubscriptionPlan(subscriptionPlan),
			}),
			status: this.#mapSubscriptionStatus(stripeSubscription.status),
			customer: stripeSubscription.customer.toString(),
			currentPeriodEnd: stripeSubscription.current_period_end,
			cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
			currentPeriodStart: stripeSubscription.current_period_end,
			cancelAt: stripeSubscription.cancel_at || null,
			latestInvoice: stripeSubscription.latest_invoice?.toString() || null,
		};
	}

	#formatSubscriptionPlan(plan: Stripe.Plan): VendorPlanType {
		return {
			...plan,
			productId: plan.product?.toString() || null,
			intervalCount: plan.interval_count,
		};
	}

	#mapSubscriptionStatus(
		status: Stripe.Subscription.Status,
	): VendorSubscriptionStatusEnum {
		return {
			active: VendorSubscriptionStatusEnum.Active,
			canceled: VendorSubscriptionStatusEnum.Canceled,
			incomplete: VendorSubscriptionStatusEnum.Incomplete,
			incomplete_expired: VendorSubscriptionStatusEnum.IncompleteExpired,
			past_due: VendorSubscriptionStatusEnum.PastDue,
			paused: VendorSubscriptionStatusEnum.Paused,
			trialing: VendorSubscriptionStatusEnum.Trialing,
			unpaid: VendorSubscriptionStatusEnum.Unpaid,
		}[status];
	}
}
