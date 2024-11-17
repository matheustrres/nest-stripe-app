// import { join } from 'node:path';

import { AdaptersModule } from '@/infra/adapters/adapters.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoreModule } from '@/@core/core.module';

import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { UsersModule } from '@/modules/users/users.module';

import { JwtAuthGuard } from '@/shared/libs/auth/guards/jwt-auth.guard';

@Module({
	imports: [
		// ServeStaticModule.forRoot({
		// 	rootPath: join(__dirname, '..', 'assets'),
		// 	serveStaticOptions: {
		// 		cacheControl: true,
		// 		extensions: ['.js'],
		// 	},
		// }),
		CoreModule,
		AdaptersModule,
		UsersModule,
		SubscriptionsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		AppService,
	],
	controllers: [AppController],
})
export class AppModule {}
