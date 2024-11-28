import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { GuestSignUpUseCaseInput } from '@/modules/guests/application/use-cases/sign-up.use-case';

export class GuestSignUpBodyDto
	implements Omit<GuestSignUpUseCaseInput, 'token'>
{
	@ApiProperty({
		type: 'string',
		example: 'John Doe',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		type: 'string',
		example: 'ghx1369O*)5v',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	password!: string;
}
