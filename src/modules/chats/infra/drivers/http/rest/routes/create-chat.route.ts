import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateChatBodyDto } from '@/modules/chats/infra/drivers/http/rest/dtos/create-chat.dto';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function CreateChatSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: 'Create a new chat',
			tags: ['chat'],
			deprecated: false,
		},
		body: {
			type: CreateChatBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description: 'Invalid credentials.',
			},
			{
				status: HttpStatusCodeEnum.CONFLICT,
				description: 'A chat already exists with given name.',
			},
			{
				status: HttpStatusCodeEnum.CREATED,
				description: 'Chat successfully created.',
			},
		],
	});
}
