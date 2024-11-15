import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { SignInUseCaseInput } from '@/modules/users/application/use-cases/sign-in.use-case';

export class SignInBodyDto implements SignInUseCaseInput {
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'john.doe@gmail.com',
	})
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'bY139T+#7TBs',
	})
	@IsString()
	@IsNotEmpty()
	password!: string;
}
