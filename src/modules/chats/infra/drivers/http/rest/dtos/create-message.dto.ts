import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { WithoutUserId } from '@/@core/types';

import { CreateMessageUseCaseInput } from '@/modules/chats/application/use-cases/create-message.use-case';

import { IsCuid } from '@/shared/libs/pipes/is-cuid.pipe';

export class CreateMessageBodyDto
	implements WithoutUserId<CreateMessageUseCaseInput>
{
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'cm45repef000008k233x08h4n',
	})
	@IsCuid()
	@IsNotEmpty()
	chatId!: string;

	@ApiProperty({
		type: 'string',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	content!: string;
}
