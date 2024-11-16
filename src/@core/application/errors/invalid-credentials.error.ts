import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidCredentialsError extends AppError {
	constructor(message = 'Invalid credentials') {
		super({
			code: HttpStatusCodeEnum.UNAUTHORIZED,
			message,
		});
	}
}
