import { Body, HttpCode, Post } from '@nestjs/common';

import { CreateSubscriptionBodyDto } from './dtos/create-subscription.dto';
import { CreateSubscriptionSwaggerRoute } from './swagger/create-subscription.route';
import {
	SubscriptionHttpResponse,
	SubscriptionViewModel,
} from './view-models/subscription.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateSubscriptionUseCase } from '@/modules/subscriptions/application/use-cases/create-subscription.use-case';

import { ProtectedRoute } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	GetUserSession,
	UserSession,
} from '@/shared/libs/auth/decorators/user-session.decorator';
import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Subscriptions)
export class SubscriptionsController {
	constructor(
		private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
	) {}

	@Post()
	@HttpCode(HttpStatusCodeEnum.CREATED)
	@ProtectedRoute()
	@CreateSubscriptionSwaggerRoute()
	async createSubscriptionRoute(
		@GetUserSession() userSession: UserSession,
		@Body() body: CreateSubscriptionBodyDto,
	): Promise<SubscriptionHttpResponse> {
		const { subscription } = await this.createSubscriptionUseCase.exec({
			...body,
			userId: userSession.sub,
		});
		return SubscriptionViewModel.toHttp(subscription);
	}
}
