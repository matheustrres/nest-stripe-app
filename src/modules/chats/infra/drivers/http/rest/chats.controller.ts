import { Body, HttpCode, Post } from '@nestjs/common';

import { CreateChatBodyDto } from './dtos/create-chat.dto';
import { CreateChatSwaggerRoute } from './routes/create-chat.route';
import { ChatHttpResponse, ChatViewModel } from './view-models/chat.view-model';

import { ApiPathsEnum } from '@/@core/enums/api-paths';
import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { CreateChatUseCase } from '@/modules/chats/application/use-cases/create-chat.use-case';

import { ProtectedRoute } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	GetUserSession,
	UserSession,
} from '@/shared/libs/auth/decorators/user-session.decorator';
import { OpenApiController } from '@/shared/libs/swagger/openapi';

@OpenApiController(ApiPathsEnum.Chats)
export class ChatsController {
	constructor(private readonly createChatUseCase: CreateChatUseCase) {}

	@Post()
	@ProtectedRoute()
	@HttpCode(HttpStatusCodeEnum.CREATED)
	@CreateChatSwaggerRoute()
	async createChatRoute(
		@GetUserSession() userSession: UserSession,
		@Body() body: CreateChatBodyDto,
	): Promise<ChatHttpResponse> {
		const { chat } = await this.createChatUseCase.exec({
			...body,
			userId: userSession.sub,
		});
		return ChatViewModel.toHttp(chat);
	}
}
