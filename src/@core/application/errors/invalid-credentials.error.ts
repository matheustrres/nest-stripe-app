import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidCredentialsError extends AppError {
	constructor() {
		super({
			code: HttpStatusCodeEnum.UNAUTHORIZED,
			message: 'Invalid credentials',
		});
	}
}
