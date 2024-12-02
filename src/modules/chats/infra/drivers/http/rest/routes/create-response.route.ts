import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateResponseBodyDto } from '@/modules/chats/infra/drivers/http/rest/dtos/create-response.dto';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function CreateResponseSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: 'Create a new response to a message',
		},
		body: {
			type: CreateResponseBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.CREATED,
				description: 'Response successfully created',
			},
		],
	});
}
