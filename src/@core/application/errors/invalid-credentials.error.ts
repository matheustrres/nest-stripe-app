import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidCredentialsError extends AppError {
	constructor(message = 'Invalid credentials') {
		super({
			code: HttpStatusCodeEnum.UNAUTHORIZED,
			message,
		});
	}

	static byValidationCode(): InvalidCredentialsError {
		return new InvalidCredentialsError('Invalid or expired validation code.');
	}

	static byAuthenticationToken(): InvalidCredentialsError {
		return new InvalidCredentialsError(
			'Invalid or expired authentication token. Please, try again later or contact the support.',
		);
	}
}
