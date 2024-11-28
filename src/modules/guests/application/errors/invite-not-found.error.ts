import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InviteNotFoundError extends AppError {
	private constructor(message: string, code = HttpStatusCodeEnum.NOT_FOUND) {
		super({
			code,
			message,
		});
	}

	static byId(id: string): InviteNotFoundError {
		return new InviteNotFoundError(`No invite was found with ID "${id}".`);
	}
}
