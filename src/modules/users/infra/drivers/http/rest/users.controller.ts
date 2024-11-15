import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { SignInBodyDto } from './dtos/sign-in.dto';
import { SignUpBodyDto } from './dtos/sign-up.dto';

import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { SignInUseCase } from '@/modules/users/application/use-cases/sign-in.use-case';
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up.use-case';

@Controller('users')
export class UsersController {
	constructor(
		private readonly signInUseCase: SignInUseCase,
		private readonly signUpUseCase: SignUpUseCase,
	) {}

	@Post('/sign-in')
	@HttpCode(HttpStatusCodeEnum.OK)
	async signInRoute(@Body() body: SignInBodyDto) {
		return this.signInUseCase.exec(body);
	}

	@Post('/sign-up')
	@HttpCode(HttpStatusCodeEnum.CREATED)
	async signUpRoute(@Body() body: SignUpBodyDto) {
		return this.signUpUseCase.exec(body);
	}
}
