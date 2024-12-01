import { Module } from '@nestjs/common';

import { ChatsRepository } from './application/repositories/chats.repository';
import { MessagesRepository } from './application/repositories/messages.repository';
import { ResponsesRepository } from './application/repositories/responses.repository';
import { CreateChatUseCase } from './application/use-cases/create-chat.use-case';
import { PrismaChatsRepository } from './infra/drivers/database/chats.repository';
import { PrismaMessagesRepository } from './infra/drivers/database/messages.repository';
import { PrismaResponsesRepository } from './infra/drivers/database/responses.repository';

import { UsersModule } from '@/modules/users/users.module';

import { PrismaModule } from '@/shared/modules/prisma/prisma.module';

@Module({
	imports: [PrismaModule, UsersModule],
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
		CreateChatUseCase,
	],
	exports: [ChatsRepository, MessagesRepository],
})
export class ChatsModule {}
