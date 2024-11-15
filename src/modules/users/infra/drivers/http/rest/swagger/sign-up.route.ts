import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { SignUpBodyDto } from '@/modules/users/infra/drivers/http/rest/dtos/sign-up.dto';

import { OpenApiRoute } from '@/shared/libs/swagger/openapi';

export function SignUpSwaggerRoute() {
	return OpenApiRoute({
		operation: {
			description: 'Create a user in the API',
			tags: ['user', 'sign-up', 'creation'],
			deprecated: false,
		},
		body: {
			type: SignUpBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.CONFLICT,
				description: 'Given email address is already in use',
			},
			{
				status: HttpStatusCodeEnum.CREATED,
				description: 'User successfully created',
			},
		],
	});
}
