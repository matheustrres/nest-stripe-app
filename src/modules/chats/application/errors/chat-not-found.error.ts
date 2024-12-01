import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class ChatNotFoundError extends AppError {
	constructor(message: string, code = HttpStatusCodeEnum.NOT_FOUND) {
		super({
			code,
			message,
		});
	}

	static byId(id: string): ChatNotFoundError {
		return new ChatNotFoundError(`No chat was found with ID "${id}".`);
	}
}
