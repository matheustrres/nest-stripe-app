import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class UserAlreadyExistsError extends AppError {
	private constructor(message: string, code = HttpStatusCodeEnum.CONFLICT) {
		super({
			code,
			message,
		});
	}

	static byEmail(email: string): UserAlreadyExistsError {
		return new UserAlreadyExistsError(
			`The following email address "${email}" is already in use.`,
		);
	}
}
