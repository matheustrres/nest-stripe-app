import { Injectable, Logger } from '@nestjs/common';

import { DateService } from '@/@core/application/services/date.service';
import { MailingService } from '@/@core/application/services/mailing.service';
import { RetryService } from '@/@core/application/services/retry.service';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { SubscriptionDomainEventsEnum } from '@/@core/enums/domain-events';

import { VendorPaymentsClient } from '@/modules/subscriptions/application/clients/payments/payments.client';
import { RefundSubscriptionDomainEvent } from '@/modules/subscriptions/domain/events/refund-subscription.event';

import { OnDomainEvent } from '@/shared/utils/decorators/on-domain-event';

// eslint-disable-next-line import-helpers/order-imports
import { SubscriptionRefundedTemplate } from '$/templates/subscription-refunded';
import { formatCurrencyFromCents } from '@/shared/utils/funcs/format-currency';

@Injectable()
export class RefundSubscriptionDomainEventListener {
	readonly #logger = new Logger(RefundSubscriptionDomainEventListener.name);

	readonly #MAX_RETRIES = 3;
	readonly #BASE_DELAY_IN_MS = 1_000; // 1 second

	constructor(
		private readonly dateService: DateService,
		private readonly eventEmitter: EventEmitter,
		private readonly mailingService: MailingService,
		private readonly retryService: RetryService,
		private readonly vendorPaymentsClient: VendorPaymentsClient,
	) {}

	@OnDomainEvent(SubscriptionDomainEventsEnum.RefundRequest)
	async handle(event: RefundSubscriptionDomainEvent): Promise<void> {
		const {
			customerId,
			customerName,
			customerEmail,
			subscriptionId,
			subscriptionLatestInvoiceId,
		} = event.data;
		const retryKey = `${customerId}:${subscriptionId}`;

		try {
			const vendorSubscriptionRefundingResult =
				await this.vendorPaymentsClient.subscriptions.refund(
					subscriptionLatestInvoiceId,
				);
			if (vendorSubscriptionRefundingResult.isLeft()) {
				this.#logger.error(
					`Error refunding subscription "${subscriptionId}": ${JSON.stringify(
						vendorSubscriptionRefundingResult.value,
					)}`,
				);
				return;
			}

			const { amount, created } = vendorSubscriptionRefundingResult.value;

			this.#logger.log(
				`Subscription "${subscriptionId}" refunded: ${JSON.stringify(
					vendorSubscriptionRefundingResult.value,
				)}`,
			);
			this.retryService.removeRetry(retryKey);
			this.mailingService.sendMail({
				to: customerEmail,
				from: 'StripeApp <onboarding@resend.dev>',
				subject: 'Subscription refunded',
				text: 'Subscription refunded',
				html: SubscriptionRefundedTemplate({
					name: customerName,
					refundAmount: formatCurrencyFromCents(amount),
					refundDate: this.dateService.convertTimestampToDateString(created),
				}),
			});
		} catch (error) {
			this.#logger.error(
				'Error refunding user subscription: ',
				console.trace(error),
			);
			this.#handleRetry(retryKey, event);
		}
	}

	async #handleRetry(retryKey: string, event: RefundSubscriptionDomainEvent) {
		const retry = this.retryService.fetchRetry(retryKey);
		if (retry.attempts >= this.#MAX_RETRIES) {
			this.#logger.error(
				`Maximum retry attempts reached for refunding subscription "${retryKey}"`,
			);

			/**
			 * @todo Implement SubscriptonRefundFailedDomainEvent for failed subscription refund
			 */
			// const subscriptionId = retryKey.split(':')[1]!;
			// this.eventEmitter.emit(
			// 	new SubscriptonRefundFailedDomainEvent({
			// 		retryAttemps: this.#MAX_RETRIES,
			// 		subscriptionId,
			// 	}),
			// );
			console.log('Emitted SubscriptonRefundFailedDomainEvent');
			this.retryService.removeRetry(retryKey);

			return;
		}

		/**
		 * @todo Increase delay time
		 */
		const delay =
			this.#BASE_DELAY_IN_MS * Math.pow(this.#MAX_RETRIES, retry.attempts);
		this.retryService.addRetry(retryKey, retry.attempts + 1, delay);

		setTimeout(() => this.eventEmitter.emit(event), delay);
	}
}
