import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { SignInBodyDto } from '@/modules/users/infra/drivers/http/rest/dtos/sign-in.dto';

import { OpenApiRoute } from '@/shared/libs/swagger/openapi';

export function SignInSwaggerRoute() {
	return OpenApiRoute({
		operation: {
			description: 'Authenticates a user to the API',
			tags: ['user', 'sign-in', 'authentication'],
			deprecated: false,
		},
		body: {
			type: SignInBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description: 'The credentials provided are invalid',
			},
			{
				status: HttpStatusCodeEnum.OK,
				description: 'User successfully authenticated',
			},
		],
	});
}
