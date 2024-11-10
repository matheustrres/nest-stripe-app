import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCode } from '@/@core/enums/http-status-code';

export class UserAlreadyExistsError extends AppError {
	private constructor(message: string, code = HttpStatusCode.CONFLICT) {
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
