import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { ConfirmUserAccountBodyDto } from '@/modules/users/infra/drivers/http/rest/dtos/confirm-account.dto';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function ConfirmUserAccountSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: 'Confirms a user account',
			tags: ['user', 'account', 'confirmation'],
			deprecated: false,
		},
		body: {
			type: ConfirmUserAccountBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description: 'Either the email address or confirmation code is invalid',
			},
			{
				status: HttpStatusCodeEnum.OK,
				description: 'User account successfully confirmed',
			},
		],
	});
}
