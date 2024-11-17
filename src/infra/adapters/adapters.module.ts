import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { NestEventEmitterAdapter } from './events/emitter/event-emitter';
import { NanoIdAlphanumericCodeServiceAdapter } from './services/alpha-numeric-code.service';
import { NestCachingServiceAdapter } from './services/caching.service';
import { DateFnsDateServiceAdapter } from './services/date.service';
import { BcryptHashingServiceAdapter } from './services/hashing.service';
import { ResendMailingServiceAdapter } from './services/mailing.service';
import { JwtTokenizationServiceAdapter } from './services/tokenization.service';

import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';
import { CachingService } from '@/@core/application/services/caching.service';
import { DateService } from '@/@core/application/services/date.service';
import { HashingService } from '@/@core/application/services/hashing.service';
import { MailingService } from '@/@core/application/services/mailing.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
			store: 'memory',
		}),
		EventEmitterModule.forRoot({
			global: true,
		}),
	],
	providers: [
		{
			provide: AlphanumericCodeService,
			useClass: NanoIdAlphanumericCodeServiceAdapter,
		},
		{
			provide: CachingService,
			useClass: NestCachingServiceAdapter,
		},
		{
			provide: DateService,
			useClass: DateFnsDateServiceAdapter,
		},
		{
			provide: EventEmitter,
			useClass: NestEventEmitterAdapter,
		},
		{
			provide: HashingService,
			useClass: BcryptHashingServiceAdapter,
		},
		{
			provide: MailingService,
			useClass: ResendMailingServiceAdapter,
		},
		{
			provide: TokenizationService,
			useClass: JwtTokenizationServiceAdapter,
		},
	],
	exports: [
		AlphanumericCodeService,
		CachingService,
		DateService,
		EventEmitter,
		HashingService,
		MailingService,
		TokenizationService,
	],
})
export class AdaptersModule {}
