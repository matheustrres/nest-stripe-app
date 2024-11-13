import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env/validate';
import { CorePlansDomainService } from './domain/services/vendor-plans.service';
import { CoreTokensDomainService } from './domain/services/vendor-tokens.service';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.dev', '.env.test'],
			validate: (config: Record<string, unknown>) => validateEnv(config),
		}),
	],
	providers: [CorePlansDomainService, CoreTokensDomainService],
	exports: [CorePlansDomainService, CoreTokensDomainService],
})
export class CoreModule {}
