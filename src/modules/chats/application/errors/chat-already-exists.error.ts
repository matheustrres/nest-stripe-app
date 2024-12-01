import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class ChatAlreadyExistsError extends AppError {
	constructor(message: string, code = HttpStatusCodeEnum.CONFLICT) {
		super({
			code,
			message,
		});
	}

	static byName(name: string): ChatAlreadyExistsError {
		return new ChatAlreadyExistsError(
			`You already have a chat named "${name}".`,
		);
	}
}
