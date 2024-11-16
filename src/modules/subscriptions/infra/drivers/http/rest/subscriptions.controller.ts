import { Body, HttpCode, Post } from '@nestjs/common';

import { CreateSubscriptionBodyDto } from './dtos/create-subscription.dto';
import { CancelSubscriptionSwaggerRoute } from './swagger/cancel-subscription.route';
import { CreateSubscriptionSwaggerRoute } from './swagger/create-subscription.route';
import {
	SubscriptionHttpResponse,
	SubscriptionViewModel,
} from './view-models/subscription.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CancelSubscriptionUseCase } from '@/modules/subscriptions/application/use-cases/cancel-subscription.use-case';
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
		private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
		private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
	) {}

	@Post('cancel')
	@HttpCode(HttpStatusCodeEnum.OK)
	@ProtectedRoute()
	@CancelSubscriptionSwaggerRoute()
	async cancelSubscriptionRoute(
		@GetUserSession() userSession: UserSession,
	): Promise<SubscriptionHttpResponse> {
		const { subscription } = await this.cancelSubscriptionUseCase.exec({
			userId: userSession.sub,
		});
		return SubscriptionViewModel.toHttp(subscription);
	}

	@Post('create')
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
