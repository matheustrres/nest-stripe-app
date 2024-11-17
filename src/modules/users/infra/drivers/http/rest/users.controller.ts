import { Body, HttpCode, Post } from '@nestjs/common';

import { ConfirmUserAccountBodyDto } from './dtos/confirm-account.dto';
import { SignInBodyDto } from './dtos/sign-in.dto';
import { SignUpBodyDto } from './dtos/sign-up.dto';
import { ConfirmUserAccountSwaggerRoute } from './swagger/confirm-account.route';
import { SignInSwaggerRoute } from './swagger/sign-in.route';
import { SignUpSwaggerRoute } from './swagger/sign-up.route';
import { UserHttpResponse, UserViewModel } from './view-models/user.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { ConfirmUserAccountUseCase } from '@/modules/users/application/use-cases/confirm-account.use-case';
import { SignInUseCase } from '@/modules/users/application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up.use-case';

import { OpenApiController } from '@/shared/libs/swagger/openapi';

type SignInRouteResponseType = {
	accessToken: string;
	user: UserHttpResponse;
};

@OpenApiController(ApiPathsEnum.Users)
export class UsersController {
	constructor(
		private readonly confirmUserAccountUseCase: ConfirmUserAccountUseCase,
		private readonly signInUseCase: SignInUseCase,
		private readonly signUpUseCase: SignUpUseCase,
	) {}

	@Post('/confirm-account')
	@HttpCode(HttpStatusCodeEnum.OK)
	@ConfirmUserAccountSwaggerRoute()
	async confirmUserAccountRoute(
		@Body() body: ConfirmUserAccountBodyDto,
	): Promise<void> {
		return this.confirmUserAccountUseCase.exec(body);
	}

	@Post('/sign-in')
	@HttpCode(HttpStatusCodeEnum.OK)
	@SignInSwaggerRoute()
	async signInRoute(
		@Body() body: SignInBodyDto,
	): Promise<SignInRouteResponseType> {
		const { accessToken, user } = await this.signInUseCase.exec(body);
		return {
			accessToken,
			user: UserViewModel.toHttp(user),
		};
	}

	@Post('/sign-up')
	@HttpCode(HttpStatusCodeEnum.CREATED)
	@SignUpSwaggerRoute()
	async signUpRoute(@Body() body: SignUpBodyDto): Promise<UserHttpResponse> {
		const { user } = await this.signUpUseCase.exec(body);
		return UserViewModel.toHttp(user);
	}
}
