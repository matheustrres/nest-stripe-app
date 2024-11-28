import { Body, HttpCode, Post, Query } from '@nestjs/common';

import { GuestSignUpBodyDto } from './dtos/guest-sign-up.dto';
import { InviteGuestBodyDto } from './dtos/invite-guest.dto';
import { GuestSignUpSwaggerRoute } from './swagger/guest-sign-up.route';
import { InviteGuestSwaggerRoute } from './swagger/invite-guest.route';
import {
	InviteHttpResponse,
	InviteViewModel,
} from './view-models/invite.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { InviteGuestUseCase } from '@/modules/guests/application/use-cases/invite-guest.use-case';
import { GuestSignUpUseCase } from '@/modules/guests/application/use-cases/sign-up.use-case';
import {
	UserHttpResponse,
	UserViewModel,
} from '@/modules/users/infra/drivers/http/rest/view-models/user.view-model';

import { ProtectedRoute } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	GetUserSession,
	UserSession,
} from '@/shared/libs/auth/decorators/user-session.decorator';
import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Guests)
export class GuestsController {
	constructor(
		private readonly inviteGuestUseCase: InviteGuestUseCase,
		private readonly guestSignUpUseCase: GuestSignUpUseCase,
	) {}

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

	@Post('/sign-up')
	@GuestSignUpSwaggerRoute()
	async guestSignUpRoute(
		@Body() body: GuestSignUpBodyDto,
		@Query('token') token: string,
	): Promise<UserHttpResponse> {
		const { user } = await this.guestSignUpUseCase.exec({
			...body,
			token,
		});
		return UserViewModel.toHttp(user);
	}
}
