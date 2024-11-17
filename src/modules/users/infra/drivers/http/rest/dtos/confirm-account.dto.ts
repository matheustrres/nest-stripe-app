import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { ConfirmUserAccountUseCaseInput } from '@/modules/users/application/use-cases/confirm-account.use-case';

export class ConfirmUserAccountBodyDto
	implements ConfirmUserAccountUseCaseInput
{
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'AB1C2',
	})
	@IsString()
	@IsNotEmpty()
	code!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'john.doe@gmail.com',
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;
}
