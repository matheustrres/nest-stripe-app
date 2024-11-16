import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidSubscriptionActionError extends AppError {
	constructor(
		message: string,
		code: HttpStatusCodeEnum = HttpStatusCodeEnum.BAD_REQUEST,
	) {
		super({
			code,
			message,
		});
	}

	static byCreatingCustomer(): InvalidSubscriptionActionError {
		return new InvalidSubscriptionActionError(
			'An error was found while creating customer',
			HttpStatusCodeEnum.BAD_REQUEST,
		);
	}

	static byCreatingSubscription(): InvalidSubscriptionActionError {
		return new InvalidSubscriptionActionError(
			'An error was found while creating subscription',
			HttpStatusCodeEnum.BAD_REQUEST,
		);
	}

	static paymentMethodNotFound(
		paymentMethodId: string,
	): InvalidSubscriptionActionError {
		return new InvalidSubscriptionActionError(
			`No payment method "${paymentMethodId}" was found.`,
			HttpStatusCodeEnum.NOT_FOUND,
		);
	}

	static productNotFound(productId: string): InvalidSubscriptionActionError {
		return new InvalidSubscriptionActionError(
			`No product "${productId}" was found.`,
			HttpStatusCodeEnum.NOT_FOUND,
		);
	}
}
