import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { UseCase } from '@/@core/application/use-case';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';

import {
	VendorPaymentsClient,
	VendorSubscriptionStatusEnum,
	VendorSubscriptionType,
} from '@/modules/subscriptions/application/clients/payments/payments.client';
import { InvalidSubscriptionActionError } from '@/modules/subscriptions/application/errors/invalid-subscription-action.error';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import { RefundSubscriptionDomainEvent } from '@/modules/subscriptions/domain/events/refund-subscription.event';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import { SubscriptionStatusValueObject } from '@/modules/subscriptions/domain/value-objects/subscription-status';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

export type CancelSubscriptionUseCaseInput = {
	userId: string;
};

export type CancelSubscriptionUseCaseOutput = {
	subscription: SubscriptionEntity;
};

@Injectable()
export class CancelSubscriptionUseCase
	implements
		UseCase<CancelSubscriptionUseCaseInput, CancelSubscriptionUseCaseOutput>
{
	constructor(
		private readonly dateService: DateService,
		private readonly eventEmitter: EventEmitter,
		private readonly subscriptionsRepository: SubscriptionsRepository,
		private readonly usersRepository: UsersRepository,
		private readonly vendorPaymentsClient: VendorPaymentsClient,
	) {}

	async exec({
		userId,
	}: CancelSubscriptionUseCaseInput): Promise<CancelSubscriptionUseCaseOutput> {
		const user = await this.usersRepository.findById(userId, {
			relations: {
				subscription: true,
			},
		});
		if (!user) throw new InvalidCredentialsError();

		const { subscription: userSubscription, name, email } = user.getProps();

		if (!userSubscription) throw SubscriptionNotFoundError.byUser(userId);

		const { status: subscriptionStatus, vendorSubscriptionId } =
			userSubscription.getProps();

		const vendorSubscriptionFindingResult =
			await this.vendorPaymentsClient.subscriptions.findById(
				vendorSubscriptionId,
			);
		if (vendorSubscriptionFindingResult.isLeft())
			throw SubscriptionNotFoundError.byCurrentVendorSubscription(
				vendorSubscriptionId,
			);

		const vendorSubscription = vendorSubscriptionFindingResult.value;

		await this.#syncSubscriptionStatus(vendorSubscription, userSubscription);

		const isSubscriptionCanceled = this.#isSubscriptionCanceled(
			subscriptionStatus.status,
			vendorSubscription.status,
		);
		if (isSubscriptionCanceled)
			throw new InvalidSubscriptionActionError(
				'Only active subscriptions can be canceled',
			);

		const cancelingVendorSubscriptionResult =
			await this.vendorPaymentsClient.subscriptions.cancel(
				vendorSubscriptionId,
			);
		if (cancelingVendorSubscriptionResult.isLeft())
			throw InvalidSubscriptionActionError.byCancelingSubscription();

		userSubscription.update({
			status: new SubscriptionStatusValueObject(
				vendorSubscriptionId,
				SubscriptionStatusEnum.Canceled,
				userSubscription.createdAt,
			),
		});

		await this.subscriptionsRepository.upsert(userSubscription);

		const isSubscriptionRefundable =
			this.#isSubscriptionRefundable(vendorSubscription);

		if (isSubscriptionRefundable) {
			const vendorCanceledSubscription =
				cancelingVendorSubscriptionResult.value;

			this.eventEmitter.emit(
				new RefundSubscriptionDomainEvent({
					subscriptionId: vendorCanceledSubscription.id,
					customerId: vendorCanceledSubscription.customer,
					customerName: name,
					customerEmail: email,
					subscriptionLatestInvoiceId:
						vendorSubscription.latestInvoice as string,
				}),
			);
		}

		return {
			subscription: userSubscription,
		};
	}

	async #syncSubscriptionStatus(
		vendorSubscription: VendorSubscriptionType,
		userSubscription: SubscriptionEntity,
	): Promise<void> {
		const { status: subscriptionStatus, vendorSubscriptionId } =
			userSubscription.getProps();

		if (
			vendorSubscription.status == VendorSubscriptionStatusEnum.Canceled &&
			subscriptionStatus.isActive()
		) {
			userSubscription.update({
				status: new SubscriptionStatusValueObject(
					vendorSubscriptionId,
					SubscriptionStatusEnum.Canceled,
					userSubscription.createdAt,
				),
			});
			await this.subscriptionsRepository.upsert(userSubscription);
		}
	}

	#isSubscriptionCanceled(
		subscriptionStatus: SubscriptionStatusEnum,
		vendorSubscriptionStatus: VendorSubscriptionStatusEnum,
	): boolean {
		return (
			subscriptionStatus == SubscriptionStatusEnum.Canceled ||
			vendorSubscriptionStatus == VendorSubscriptionStatusEnum.Canceled
		);
	}

	#isSubscriptionRefundable(
		vendorSubscription: VendorSubscriptionType,
	): boolean {
		const vendorSubscriptionCreationDate = this.dateService.fromUnixTimestamp(
			vendorSubscription.created,
		);
		const nowDate = this.dateService.now();
		const vendorSubscriptionCreationDateDiffToNow =
			this.dateService.differenceInDays({
				from: vendorSubscriptionCreationDate,
				to: nowDate,
			});

		const TRIAL_TIME_IN_DAYS = 3;

		// return vendorSubscriptionCreationDateDiffToNow <= TRIAL_TIME_IN_DAYS;
		return true;
	}
}
