import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCode } from '@/@core/enums/http-status-code';

export class UserInvalidCredentialsError extends AppError {
	constructor() {
		super({
			code: HttpStatusCode.UNAUTHORIZED,
			message: 'Invalid credentials',
		});
	}
}
