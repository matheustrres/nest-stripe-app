import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function CancelSubscriptionSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: "Cancel user's subscription",
			tags: ['subscription', 'user', 'canceling'],
			deprecated: false,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description: 'The credentials provided are invalid',
			},
			{
				status: HttpStatusCodeEnum.NOT_FOUND,
				description: 'The user has no active subscription',
			},
			{
				status: HttpStatusCodeEnum.BAD_REQUEST,
				description:
					'User has tried to cancel an already canceled subscription',
			},
			{
				status: HttpStatusCodeEnum.OK,
				description: "User's subscription successfully canceled",
			},
		],
	});
}
