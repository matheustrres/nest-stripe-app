import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidGuestSignUpActionError extends AppError {
	constructor(
		message: string,
		code: HttpStatusCodeEnum = HttpStatusCodeEnum.BAD_REQUEST,
	) {
		super({
			code,
			message,
		});
	}

	static byInviteAlreadyAcceptedOrDeclined(): InvalidGuestSignUpActionError {
		return new InvalidGuestSignUpActionError(
			`The current invite has already been accepted or declined.`,
		);
	}

	static byInviteExpirationTimeOutOfDate(): InvalidGuestSignUpActionError {
		return new InvalidGuestSignUpActionError(
			`The current invite has exceeded the expiry time.`,
		);
	}
}
