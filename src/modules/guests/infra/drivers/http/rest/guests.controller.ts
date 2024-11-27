import { Body, HttpCode, Post } from '@nestjs/common';

import { InviteGuestBodyDto } from './dtos/invite-guest.dto';
import { InviteGuestSwaggerRoute } from './swagger/invite-guest.route';
import {
	InviteHttpResponse,
	InviteViewModel,
} from './view-models/invite.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { InviteGuestUseCase } from '@/modules/guests/application/use-cases/invite-guest.use-case';

import { ProtectedRoute } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	GetUserSession,
	UserSession,
} from '@/shared/libs/auth/decorators/user-session.decorator';
import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Guests)
export class GuestsController {
	constructor(private readonly inviteGuestUseCase: InviteGuestUseCase) {}

	@Post('/invite')
	@HttpCode(HttpStatusCodeEnum.CREATED)
	@ProtectedRoute()
	@InviteGuestSwaggerRoute()
	async inviteGuestRoute(
		@GetUserSession() userSession: UserSession,
		@Body() body: InviteGuestBodyDto,
	): Promise<InviteHttpResponse> {
		const { invite } = await this.inviteGuestUseCase.exec({
			...body,
			ownerId: userSession.sub,
		});
		return InviteViewModel.toHttp(invite);
	}
}
