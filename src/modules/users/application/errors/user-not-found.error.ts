import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class UserNotFoundError extends AppError {
	private constructor(message: string, code = HttpStatusCodeEnum.CONFLICT) {
		super({
			code,
			message,
		});
	}

	static byEmail(email: string): UserNotFoundError {
		return new UserNotFoundError(
			`The following email address "${email}" is invalid.`,
		);
	}
}
