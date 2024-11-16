import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { UseCase } from '@/@core/application/use-case';

import {
	VendorPaymentsClient,
	VendorSubscriptionStatusEnum,
} from '@/modules/subscriptions/application/clients/payments/payments.client';
import { InvalidSubscriptionActionError } from '@/modules/subscriptions/application/errors/invalid-subscription-action.error';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
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
		private readonly usersRepository: UsersRepository,
		private readonly subscriptionsRepository: SubscriptionsRepository,
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

		const userSubscription = user.getProps().subscription;
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

		const isSubscriptionCanceled =
			!subscriptionStatus.isActive() &&
			vendorSubscription.status == VendorSubscriptionStatusEnum.Canceled;
		if (isSubscriptionCanceled) {
			throw new InvalidSubscriptionActionError(
				'Only active subscriptions can be canceled',
			);
		}

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

		return {
			subscription: userSubscription,
		};

		/**
		 * Refund subscription use case
		 */
		// const vendorSubscription = vendorSubscriptionFindingResult.value;

		// const vendorSubscriptionCreationDate = this.dateService.fromUnixTimestamp(
		// 	vendorSubscription.created,
		// );
		// const now = this.dateService.now();
		// const differenceInDays = this.dateService.differenceInDays({
		// 	from: vendorSubscriptionCreationDate,
		// 	to: now,
		// });

		// const TRIAL_TIME_IN_DAYS = 3;

		// if (differenceInDays < TRIAL_TIME_IN_DAYS) {

		// }l
	}
}
