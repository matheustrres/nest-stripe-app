import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { EnvService } from '@/@core/config/env/env.service';

(async () => {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);
	const envService = app.get(EnvService);
	const appPort = envService.getKeyOrThrow('PORT');
	await app.listen(appPort);
})();
