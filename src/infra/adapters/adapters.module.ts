import { Module } from '@nestjs/common';

import { DateFnsDateServiceAdapter } from './services/date.service';
import { BcryptHashingServiceAdapter } from './services/hashing.service';
import { JwtTokenizationServiceAdapter } from './services/tokenization.service';

import { DateService } from '@/@core/application/services/date.service';
import { HashingService } from '@/@core/application/services/hashing.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';

@Module({
	providers: [
		{
			provide: DateService,
			useClass: DateFnsDateServiceAdapter,
		},
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
