import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidResponseActionError extends AppError {
	constructor(message: string, code = HttpStatusCodeEnum.BAD_REQUEST) {
		super({
			code,
			message,
		});
	}

	static byInsufficientTokens(): InvalidResponseActionError {
		return new InvalidResponseActionError('Insufficient tokens.');
	}

	static byInvalidSubscription(): InvalidResponseActionError {
		return new InvalidResponseActionError(
			'Current subscription is either invalid or canceled.',
		);
	}
}
