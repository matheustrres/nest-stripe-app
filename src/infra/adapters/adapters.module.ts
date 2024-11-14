import { Module } from '@nestjs/common';

import { BcryptHashingServiceAdapter } from './services/hashing.service';
import { JwtTokenizationServiceAdapter } from './services/tokenization.service';

import { HashingService } from '@/@core/application/services/hashing.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';

@Module({
	providers: [
		{
			provide: HashingService,
			useClass: BcryptHashingServiceAdapter,
		},
		{
			provide: TokenizationService,
			useClass: JwtTokenizationServiceAdapter,
		},
	],
	exports: [HashingService, TokenizationService],
})
export class AdaptersModule {}
