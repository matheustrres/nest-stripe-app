import { Injectable, Logger } from '@nestjs/common';

import { DateService } from '@/@core/application/services/date.service';
import { MailingService } from '@/@core/application/services/mailing.service';
import { RetryService } from '@/@core/application/services/retry.service';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { SubscriptionDomainEventsEnum } from '@/@core/enums/domain-events';

import { VendorPaymentsClient } from '@/modules/subscriptions/application/clients/payments/payments.client';
import { RefundSubscriptionDomainEvent } from '@/modules/subscriptions/domain/events/refund-subscription.event';

import { OnDomainEvent } from '@/shared/utils/decorators/on-domain-event';
import { formatCurrencyFromCents } from '@/shared/utils/funcs/format-currency';
import {
	convertMilliseconds,
	toMilliseconds,
} from '@/shared/utils/funcs/milliseconds';

// eslint-disable-next-line import-helpers/order-imports
import { SubscriptionRefundedTemplate } from '$/templates/subscription-refunded';

@Injectable()
export class RefundSubscriptionDomainEventListener {
	readonly #logger = new Logger(RefundSubscriptionDomainEventListener.name);

	readonly #MAX_RETRY_ATTEMPS = 3;
	readonly #RETRY_DELAY_IN_MS: number;

	constructor(
		private readonly dateService: DateService,
		private readonly eventEmitter: EventEmitter,
		private readonly mailingService: MailingService,
		private readonly retryService: RetryService,
		private readonly vendorPaymentsClient: VendorPaymentsClient,
	) {
		this.#RETRY_DELAY_IN_MS = toMilliseconds({
			hours: 1,
		});
	}

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

		const vendorSubscriptionRefundingResult =
			await this.vendorPaymentsClient.subscriptions.refund(
				subscriptionLatestInvoiceId,
			);
		if (vendorSubscriptionRefundingResult.isLeft()) {
			this.#logger.error(`Error refunding subscription "${subscriptionId}"`);
			this.#handleRetry(retryKey, event);
			return;
		}

		const { amount, created } = vendorSubscriptionRefundingResult.value;

		this.#logger.log(
			`Subscription "${subscriptionId}" refunded: ${JSON.stringify(
				vendorSubscriptionRefundingResult.value,
			)}`,
		);
		this.retryService.removeRetry(retryKey);
		await this.mailingService.sendMail({
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
	}

	async #handleRetry(retryKey: string, event: RefundSubscriptionDomainEvent) {
		const retry = this.retryService.fetchRetry(retryKey);
		if (retry.attempts >= this.#MAX_RETRY_ATTEMPS) {
			this.#logger.error(
				`Maximum retry attempts reached for refunding subscription "${retryKey}"`,
			);

			/**
			 * @todo Implement SubscriptonRefundFailedDomainEvent for failed subscription refund
			 */
			// const subscriptionId = retryKey.split(':')[1]!;
			// this.eventEmitter.emit(
			// 	new SubscriptonRefundFailedDomainEvent({
			// 		retryAttemps: this.#MAX_RETRY_ATTEMPS,
			// 		subscriptionId,
			// 	}),
			// );
			this.#logger.warn('Emitted SubscriptonRefundFailedDomainEvent');
			this.retryService.removeRetry(retryKey);
			return;
		}

		const delay = this.#calcRetryAttemptDelay(retry.attempts);

		this.#logger.warn(
			`Retrying refund for subscription "${retryKey}" in ${JSON.stringify(convertMilliseconds(delay))} (Attempt ${
				retry.attempts + 1
			}/${this.#MAX_RETRY_ATTEMPS})`,
		);

		this.retryService.addRetry(retryKey, retry.attempts + 1, delay);

		setTimeout(() => this.eventEmitter.emit(event), delay);
	}

	#calcRetryAttemptDelay(attempts: number) {
		const MAX_DELAY_IN_MS = toMilliseconds({ hours: 24 });
		return Math.min(
			this.#RETRY_DELAY_IN_MS * Math.pow(2, attempts),
			MAX_DELAY_IN_MS,
		);
	}
}
