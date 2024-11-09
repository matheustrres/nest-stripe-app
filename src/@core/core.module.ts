import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env/validate';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.dev', '.env.test'],
			validate: (config: Record<string, unknown>) => validateEnv(config),
		}),
	],
})
export class CoreModule {}
