import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { WithoutUserId } from '@/@core/types';

import { CreateResponseUseCaseInput } from '@/modules/chats/application/use-cases/create-response.use-case';
import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

import { IsCuid } from '@/shared/libs/pipes/is-cuid.pipe';

export class CreateResponseBodyDto
	implements WithoutUserId<CreateResponseUseCaseInput>
{
	@ApiProperty({
		type: 'string',
		enum: ChatTypeEnum,
		required: true,
		example: ChatTypeEnum.ConsumerLaw,
	})
	@IsString()
	@IsEnum(ChatTypeEnum)
	@IsNotEmpty()
	chatType!: ChatTypeEnum;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'cm47ktgh3000008l5e7b629yo',
	})
	@IsCuid()
	@IsNotEmpty()
	messageId!: string;

	@ApiProperty({
		type: 'string',
		enum: AIModelEnum,
		required: true,
		example: AIModelEnum.Gemini1_0Pro,
	})
	@IsString()
	@IsEnum(AIModelEnum)
	@IsNotEmpty()
	model!: AIModelEnum;
}
