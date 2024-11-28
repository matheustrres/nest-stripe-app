import { AppError } from '@/@core/application/errors/app-error';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export class InvalidInvitationActionError extends AppError {
	constructor(
		message: string,
		code: HttpStatusCodeEnum = HttpStatusCodeEnum.BAD_REQUEST,
	) {
		super({
			code,
			message,
		});
	}

	static byExceededPlanMaxInvitations(): InvalidInvitationActionError {
		return new InvalidInvitationActionError(
			'Your plan has exceeded the maximum number of invitations. Consider upgrading to a new plan.',
		);
	}
}
