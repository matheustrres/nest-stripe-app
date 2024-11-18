import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvService } from './config/env/env.service';
import { validateEnv } from './config/env/validate';
import { VendorProductsCatalogDomainService } from './domain/services/vendor-products-catalog.service';
import { VendorTokensDomainService } from './domain/services/vendor-tokens.service';

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
		VendorProductsCatalogDomainService,
		VendorTokensDomainService,
	],
	exports: [
		EnvService,
		VendorProductsCatalogDomainService,
		VendorTokensDomainService,
	],
})
export class CoreModule {}
