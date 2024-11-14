import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidVendorSubscriptionActionError extends AppError {
	constructor(
		message: string,
		code: HttpStatusCodeEnum = HttpStatusCodeEnum.BAD_REQUEST,
	) {
		super({
			code,
			message,
		});
	}

	static byCreatingCustomer(): InvalidVendorSubscriptionActionError {
		return new InvalidVendorSubscriptionActionError(
			'An error was found while creating customer',
			HttpStatusCodeEnum.BAD_REQUEST,
		);
	}

	static byCreatingSubscription(): InvalidVendorSubscriptionActionError {
		return new InvalidVendorSubscriptionActionError(
			'An error was found while creating subscription',
			HttpStatusCodeEnum.BAD_REQUEST,
		);
	}

	static paymentMethodNotFound(
		paymentMethodId: string,
	): InvalidVendorSubscriptionActionError {
		return new InvalidVendorSubscriptionActionError(
			`No payment method "${paymentMethodId}" was found.`,
			HttpStatusCodeEnum.NOT_FOUND,
		);
	}

	static productNotFound(
		productId: string,
	): InvalidVendorSubscriptionActionError {
		return new InvalidVendorSubscriptionActionError(
			`No product "${productId}" was found.`,
			HttpStatusCodeEnum.NOT_FOUND,
		);
	}
}
