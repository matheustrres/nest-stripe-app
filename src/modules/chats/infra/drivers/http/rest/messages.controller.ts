import { Body, HttpCode, Post } from '@nestjs/common';

import { CreateMessageBodyDto } from './dtos/create-message.dto';
import { CreateMessageSwaggerRoute } from './routes/create-message.route';
import {
	MessageHttpResponse,
	MessageViewModel,
} from './view-models/message.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateMessageUseCase } from '@/modules/chats/application/use-cases/create-message.use-case';

import { ProtectedRoute } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	GetUserSession,
	UserSession,
} from '@/shared/libs/auth/decorators/user-session.decorator';
import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Messages)
export class MessagesController {
	constructor(private readonly createMessageUseCase: CreateMessageUseCase) {}

	@Post()
	@ProtectedRoute()
	@HttpCode(HttpStatusCodeEnum.CREATED)
	@CreateMessageSwaggerRoute()
	async createMessageRoute(
		@GetUserSession() userSession: UserSession,
		@Body() body: CreateMessageBodyDto,
	): Promise<MessageHttpResponse> {
		const { message } = await this.createMessageUseCase.exec({
			...body,
			userId: userSession.sub,
		});

		return MessageViewModel.toHttp(message);
	}
}
