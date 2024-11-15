import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export type UserSession = Request['user'];

export const GetUserSession = createParamDecorator(
	(_: never, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();

		return request.user;
	},
);
