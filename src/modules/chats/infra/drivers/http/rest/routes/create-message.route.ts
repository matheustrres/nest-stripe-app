import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateMessageBodyDto } from '@/modules/chats/infra/drivers/http/rest/dtos/create-message.dto';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function CreateMessageSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: 'Create a new message in a chat',
			tags: ['message', 'chat'],
			deprecated: false,
		},
		body: {
			type: CreateMessageBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description: 'Invalid credentials.',
			},
			{
				status: HttpStatusCodeEnum.NOT_FOUND,
				description: 'No chat was found with given id.',
			},
			{
				status: HttpStatusCodeEnum.CREATED,
				description: 'Message successfully created.',
			},
		],
	});
}
