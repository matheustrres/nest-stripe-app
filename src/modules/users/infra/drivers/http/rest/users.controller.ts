import { Body, HttpCode, Post } from '@nestjs/common';

import { SignInBodyDto } from './dtos/sign-in.dto';
import { SignUpBodyDto } from './dtos/sign-up.dto';
import { SignInSwaggerResponse } from './responses/sign-in.response';
import { SignUpSwaggerResponse } from './responses/sign-up.response';
import { UserViewModel } from './view-models/user.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { SignInUseCase } from '@/modules/users/application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up.use-case';

import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Users)
export class UsersController {
	constructor(
		private readonly signInUseCase: SignInUseCase,
		private readonly signUpUseCase: SignUpUseCase,
	) {}

	@Post('/sign-in')
	@HttpCode(HttpStatusCodeEnum.OK)
	@SignInSwaggerResponse()
	async signInRoute(@Body() body: SignInBodyDto) {
		const { accessToken, user } = await this.signInUseCase.exec(body);
		return {
			accessToken,
			user: UserViewModel.toHttp(user),
		};
	}

	@Post('/sign-up')
	@HttpCode(HttpStatusCodeEnum.CREATED)
	@SignUpSwaggerResponse()
	async signUpRoute(@Body() body: SignUpBodyDto) {
		const { user } = await this.signUpUseCase.exec(body);
		return UserViewModel.toHttp(user);
	}
}
