import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { InviteGuestBodyDto } from '@/modules/guests/infra/drivers/http/rest/dtos/invite-guest.dto';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function InviteGuestSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: "Invite a guest to user's workspace",
			tags: ['invite', 'user', 'guest', 'workspace'],
			deprecated: false,
		},
		body: {
			type: InviteGuestBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description:
					"Either user credentials are invalid or user is not an owner or doesn't have a subscription.",
			},
			{
				status: HttpStatusCodeEnum.CONFLICT,
				description: 'Given guest email is already in use',
			},
			{
				status: HttpStatusCodeEnum.NOT_FOUND,
				description: 'Current user subscription is invalid',
			},
			{
				status: HttpStatusCodeEnum.CREATED,
				description: 'Invite successfully created',
			},
		],
	});
}
