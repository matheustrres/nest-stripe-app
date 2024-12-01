import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { WithoutUserId } from '@/@core/types';

import { CreateChatUseCaseInput } from '@/modules/chats/application/use-cases/create-chat.use-case';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

export class CreateChatBodyDto
	implements WithoutUserId<CreateChatUseCaseInput>
{
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'MyChat',
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		enum: ChatTypeEnum,
		example: ChatTypeEnum.ConsumerLaw,
	})
	@IsString()
	@IsEnum(ChatTypeEnum)
	@IsNotEmpty()
	type!: ChatTypeEnum;
}
