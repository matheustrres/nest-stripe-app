import { IsNotEmpty, IsString } from 'class-validator';

import { SignInBodyDto } from './sign-in.dto';

import { SignUpUseCaseInput } from '@/modules/users/application/use-cases/sign-up.use-case';

export class SignUpBodyDto extends SignInBodyDto implements SignUpUseCaseInput {
	@IsString()
	@IsNotEmpty()
	name!: string;
}
