import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateSubscriptionBodyDto } from '@/modules/subscriptions/infra/drivers/http/rest/dtos/create-subscription.dto';

import {
	OPEN_API_AUTH_NAME,
	OpenApiRoute,
} from '@/shared/libs/swagger/openapi';

export function CreateSubscriptionSwaggerRoute() {
	return OpenApiRoute({
		authName: OPEN_API_AUTH_NAME,
		operation: {
			description: 'Create a subscription for a user',
			tags: ['subscription', 'user'],
			deprecated: false,
		},
		body: {
			type: CreateSubscriptionBodyDto,
		},
		responses: [
			{
				status: HttpStatusCodeEnum.UNAUTHORIZED,
				description: 'The credentials provided are invalid',
			},
			{
				status: HttpStatusCodeEnum.CONFLICT,
				description: 'User already has an active subscription',
			},
			{
				status: HttpStatusCodeEnum.NOT_FOUND,
				description: 'The payment method or product entered was not found',
			},
			{
				status: HttpStatusCodeEnum.BAD_REQUEST,
				description:
					"An error was encountered when creating the user's subscription",
			},
			{
				status: HttpStatusCodeEnum.CREATED,
				description: "User's subscription successfully created",
			},
		],
	});
}
