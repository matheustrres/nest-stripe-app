import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

import { EnvService } from '@/@core/config/env/env.service';
import { NodeEnvEnum } from '@/@core/enums/node-env';

import { setupSwagger } from '@/shared/libs/swagger/setup';

enum ExitStatusEnum {
	FAILURE = 1,
	SUCCESS = 0,
}

enum ExitMessageEnum {
	FAILURE = 'App exited with an error:',
	SUCCESS = 'App exited successfully',
	UNCAUGHT_EXCEPTION = 'App exited due to an uncaught exception:',
	UNHANDLED_REJECTION = 'App exited due to an unhandled rejection:',
}

function exitWithSuccess(): never {
	console.log(ExitMessageEnum.SUCCESS);
	process.exit(ExitStatusEnum.SUCCESS);
}

function exitWithFailure(message?: string, error?: unknown): never {
	console.error(message, error);
	process.exit(ExitStatusEnum.FAILURE);
}

process.on('uncaughtException', (error: Error): never =>
	exitWithFailure(ExitMessageEnum.UNCAUGHT_EXCEPTION, error),
);

process.on('unhandledRejection', (reason: unknown) => {
	exitWithFailure(ExitMessageEnum.UNHANDLED_REJECTION, reason);
});

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

	app.enableCors({
		origin: [`http://localhost:${appPort}`],
		credentials: true,
		methods: 'GET,PUT,PATCH,POST,DELETE',
		allowedHeaders:
			'Content-Type,Accept,Authorization,Access-Control-Allow-Origin',
	});

	if (envService.getKeyOrThrow('NODE_ENV') !== NodeEnvEnum.PRODUCTION) {
		setupSwagger(app);
	}

	await app.listen(appPort);

	const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

	for (const signal of exitSignals) {
		process.on(signal, async () => {
			try {
				await app.close();
				exitWithSuccess();
			} catch (error) {
				exitWithFailure(ExitMessageEnum.FAILURE, error);
			}
		});
	}
})();
