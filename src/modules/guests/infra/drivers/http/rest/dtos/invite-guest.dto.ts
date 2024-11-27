import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { InviteGuestUseCaseInput } from '@/modules/guests/application/use-cases/invite-guest.use-case';

export class InviteGuestBodyDto
	implements Omit<InviteGuestUseCaseInput, 'ownerId'>
{
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'John Doe',
	})
	@IsString()
	@IsNotEmpty()
	guestName!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'john.doe@gmail.com',
	})
	@IsEmail()
	@IsNotEmpty()
	guestEmail!: string;
}
