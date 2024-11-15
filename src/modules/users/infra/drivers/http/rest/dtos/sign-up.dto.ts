import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { SignInBodyDto } from './sign-in.dto';

import { Role } from '@/@core/enums/user-role';

import { SignUpUseCaseInput } from '@/modules/users/application/use-cases/sign-up.use-case';

export class SignUpBodyDto extends SignInBodyDto implements SignUpUseCaseInput {
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'John Doe',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		type: 'string',
		enum: Role,
		required: false,
		example: Role.User,
	})
	@IsString()
	@IsEnum(Role)
	@IsOptional()
	role?: Role;
}
