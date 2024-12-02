import { Body, HttpCode, Post } from '@nestjs/common';

import { CreateResponseBodyDto } from './dtos/create-response.dto';
import { CreateResponseSwaggerRoute } from './routes/create-response.route';
import {
	ResponseHttpResponse,
	ResponseViewModel,
} from './view-models/response.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateResponseUseCase } from '@/modules/chats/application/use-cases/create-response.use-case';

import { ProtectedRoute } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	GetUserSession,
	UserSession,
} from '@/shared/libs/auth/decorators/user-session.decorator';
import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Responses)
export class ResponsesController {
	constructor(private readonly createResponseUseCase: CreateResponseUseCase) {}

	@Post()
	@ProtectedRoute()
	@CreateResponseSwaggerRoute()
	@HttpCode(HttpStatusCodeEnum.CREATED)
	async createResponseRoute(
		@GetUserSession() userSession: UserSession,
		@Body() body: CreateResponseBodyDto,
	): Promise<ResponseHttpResponse> {
		const { response } = await this.createResponseUseCase.exec({
			...body,
			userId: userSession.sub,
		});
		return ResponseViewModel.toHttp(response);
	}
}
