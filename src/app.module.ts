import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { AdaptersModule } from './infra/adapters/adapters.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { CoreModule } from '@/@core/core.module';

import { ChatsModule } from '@/modules/chats/chats.module';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { UsersModule } from '@/modules/users/users.module';

import { JwtAuthGuard } from '@/shared/libs/auth/guards/jwt-auth.guard';
import { GlobalExceptionFilter } from '@/shared/libs/exceptions/global-exception.filter';

@Module({
	imports: [
		CoreModule,
		AdaptersModule,
		UsersModule,
		SubscriptionsModule,
		ChatsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
		AppService,
	],
	controllers: [AppController],
})
export class AppModule {}
