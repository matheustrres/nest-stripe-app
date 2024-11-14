import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class SubscriptionAlreadyExistsError extends AppError {
	private constructor(message: string, code = HttpStatusCodeEnum.CONFLICT) {
		super({
			code,
			message,
		});
	}

	static byUser(userId: string): SubscriptionAlreadyExistsError {
		return new SubscriptionAlreadyExistsError(
			`User "${userId}" already has a subscription.`,
		);
	}
}
