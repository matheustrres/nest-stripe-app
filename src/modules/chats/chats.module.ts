import { Module } from '@nestjs/common';

import { ChatsRepository } from './application/repositories/chats.repository';
import { MessagesRepository } from './application/repositories/messages.repository';
import { ResponsesRepository } from './application/repositories/responses.repository';
import { AIService } from './application/services/ai.service';
import { CreateChatUseCase } from './application/use-cases/create-chat.use-case';
import { CreateMessageUseCase } from './application/use-cases/create-message.use-case';
import { CreateResponseUseCase } from './application/use-cases/create-response.use-case';
import { GeminiAIServiceAdapter } from './infra/adapters/services/ai.service';
import { PrismaChatsRepository } from './infra/drivers/database/chats.repository';
import { PrismaMessagesRepository } from './infra/drivers/database/messages.repository';
import { PrismaResponsesRepository } from './infra/drivers/database/responses.repository';
import { ChatsController } from './infra/drivers/http/rest/chats.controller';
import { MessagesController } from './infra/drivers/http/rest/messages.controller';
import { ResponsesController } from './infra/drivers/http/rest/responses.controller';

import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { UsersModule } from '@/modules/users/users.module';

import { PrismaModule } from '@/shared/modules/prisma/prisma.module';

@Module({
	imports: [PrismaModule, UsersModule, SubscriptionsModule],
	providers: [
		{
			provide: ChatsRepository,
			useClass: PrismaChatsRepository,
		},
		{
			provide: MessagesRepository,
			useClass: PrismaMessagesRepository,
		},
		{
			provide: ResponsesRepository,
			useClass: PrismaResponsesRepository,
		},
		{
			provide: AIService,
			useClass: GeminiAIServiceAdapter,
		},
		CreateChatUseCase,
		CreateMessageUseCase,
		CreateResponseUseCase,
	],
	controllers: [ChatsController, MessagesController, ResponsesController],
	exports: [ChatsRepository, MessagesRepository],
})
export class ChatsModule {}
