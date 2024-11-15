import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { SignInUseCaseInput } from '@/modules/users/application/use-cases/sign-in.use-case';

export class SignInBodyDto implements SignInUseCaseInput {
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;
}
