import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { Either, left, right } from '@/@core/domain/logic/either';

import {
	VendorPlanType,
	VendorRefundedSubscriptionStatusEnum,
	VendorRefundedSubscriptionType,
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

	async refund(
		latestInvoiceId: string,
	): Promise<Either<null, VendorRefundedSubscriptionType>> {
		const stripeLatestInvoice = await this.stripeClient.invoices
			.retrieve(latestInvoiceId)
			.catch(() => null);
		if (!stripeLatestInvoice) return left(null);

		const stripeRefundedSubscription = await this.stripeClient.refunds
			.create({
				charge: stripeLatestInvoice.charge!.toString(),
			})
			.catch(() => null);
		if (!stripeRefundedSubscription) return left(null);

		return right(
			this.#buildVendorRefundedSubscription(stripeRefundedSubscription),
		);
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

	#buildVendorRefundedSubscription(
		stripeRefundedSubscription: Stripe.Refund,
	): VendorRefundedSubscriptionType {
		return {
			id: stripeRefundedSubscription.id,
			amount: stripeRefundedSubscription.amount,
			currency: stripeRefundedSubscription.currency,
			reason: stripeRefundedSubscription.reason,
			status: this.#mapRefundedSubscriptionStatus(
				stripeRefundedSubscription.status,
			),
			created: stripeRefundedSubscription.created,
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

	#mapRefundedSubscriptionStatus(
		status: string | null,
	): VendorRefundedSubscriptionStatusEnum {
		if (!status) return VendorRefundedSubscriptionStatusEnum.Failed;

		return (
			{
				canceled: VendorRefundedSubscriptionStatusEnum.Canceled,
				failed: VendorRefundedSubscriptionStatusEnum.Failed,
				pending: VendorRefundedSubscriptionStatusEnum.Pending,
				requires_action: VendorRefundedSubscriptionStatusEnum.RequiresAction,
				succeeded: VendorRefundedSubscriptionStatusEnum.Succeeded,
			}[status] || VendorRefundedSubscriptionStatusEnum.Failed
		);
	}
}
