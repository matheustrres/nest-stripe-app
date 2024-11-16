import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class SubscriptionNotFoundError extends AppError {
	private constructor(message: string, code = HttpStatusCodeEnum.NOT_FOUND) {
		super({
			code,
			message,
		});
	}

	static byUser(userId: string): SubscriptionNotFoundError {
		return new SubscriptionNotFoundError(
			`User "${userId}" has no active subscription.`,
		);
	}

	static byCurrentSubscription(
		subscriptionId: string,
	): SubscriptionNotFoundError {
		return new SubscriptionNotFoundError(
			`No subscription with ID "${subscriptionId}" was found.`,
		);
	}

	static byCurrentVendorSubscription(
		vendorSubscriptionId: string,
	): SubscriptionNotFoundError {
		return new SubscriptionNotFoundError(
			`No vendor subscription with ID "${vendorSubscriptionId}" was found.`,
		);
	}
}
