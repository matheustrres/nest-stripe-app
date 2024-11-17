import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { NestEventEmitterAdapter } from './events/emitter/event-emitter';
import { NestCachingServiceAdapter } from './services/caching.service';
import { NanoIdCodeGenerationServiceAdapter } from './services/code-gen.service';
import { DateFnsDateServiceAdapter } from './services/date.service';
import { BcryptHashingServiceAdapter } from './services/hashing.service';
import { ResendMailingServiceAdapter } from './services/mailing.service';
import { JwtTokenizationServiceAdapter } from './services/tokenization.service';

import { CachingService } from '@/@core/application/services/caching.service';
import { CodeGenerationService } from '@/@core/application/services/code-gen.service';
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
			provide: CachingService,
			useClass: NestCachingServiceAdapter,
		},
		{
			provide: CodeGenerationService,
			useClass: NanoIdCodeGenerationServiceAdapter,
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
		CachingService,
		CodeGenerationService,
		DateService,
		EventEmitter,
		HashingService,
		MailingService,
		TokenizationService,
	],
})
export class AdaptersModule {}
