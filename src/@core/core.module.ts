import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RetryService } from './application/services/retry.service';
import { EnvService } from './config/env/env.service';
import { validateEnv } from './config/env/validate';
import { VendorProductsCatalogService } from './domain/services/vendor-products-catalog.service';
import { VendorTokensService } from './domain/services/vendor-tokens.service';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.dev', '.env.test'],
			validate: (config: Record<string, unknown>) => validateEnv(config),
		}),
	],
	providers: [
		EnvService,
		RetryService,
		VendorProductsCatalogService,
		VendorTokensService,
	],
	exports: [
		EnvService,
		RetryService,
		VendorProductsCatalogService,
		VendorTokensService,
	],
})
export class CoreModule {}
