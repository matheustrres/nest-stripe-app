import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class MessageNotFoundError extends AppError {
	constructor(message: string, code = HttpStatusCodeEnum.NOT_FOUND) {
		super({
			code,
			message,
		});
	}

	static byId(id: string): MessageNotFoundError {
		return new MessageNotFoundError(`No message was found with ID "${id}".`);
	}
}
