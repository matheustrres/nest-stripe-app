import { StripeModule } from '@golevelup/nestjs-stripe';
import { Module } from '@nestjs/common';

import { VendorPaymentsClient } from './application/clients/payments/payments.client';
import { SubscriptionsRepository } from './application/repositories/subscriptions.repository';
import { SubscriptionTokensService } from './application/services/tokens.service';
import { CancelSubscriptionUseCase } from './application/use-cases/cancel-subscription.use-case';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';
import { StripeVendorPaymentsClientAdapter } from './infra/adapters/clients/payments/stripe.client';
import { PrismaSubscriptionsRepository } from './infra/drivers/database/subscriptions.repository';
import { SubscriptionsController } from './infra/drivers/http/rest/subscriptions.controller';
import { RefundSubscriptionDomainEventListener } from './infra/events/listeners/refund-subscription.listener';

import { EnvService } from '@/@core/config/env/env.service';
import { NodeEnvEnum } from '@/@core/enums/node-env';

import { AdaptersModule } from '@/infra/adapters/adapters.module';

import { UsersModule } from '@/modules/users/users.module';

import { PrismaModule } from '@/shared/modules/prisma/prisma.module';

@Module({
	imports: [
		PrismaModule,
		UsersModule,
		AdaptersModule,
		StripeModule.forRootAsync(StripeModule, {
			useFactory: (envService: EnvService) => {
				const currentEnvironment = envService.getKeyOrThrow('NODE_ENV');
				const isProductionEnvironment =
					currentEnvironment === NodeEnvEnum.PRODUCTION;
				const stripeApiKey = isProductionEnvironment
					? envService.getKeyOrThrow('STRIPE_PUBLIC_KEY')
					: envService.getKeyOrThrow('STRIPE_TEST_KEY');

				return {
					apiKey: stripeApiKey,
				};
			},
			inject: [EnvService],
		}),
	],
	providers: [
		{
			provide: SubscriptionsRepository,
			useClass: PrismaSubscriptionsRepository,
		},
		{
			provide: VendorPaymentsClient,
			useClass: StripeVendorPaymentsClientAdapter,
		},
		CancelSubscriptionUseCase,
		CreateSubscriptionUseCase,
		RefundSubscriptionDomainEventListener,
		SubscriptionTokensService,
	],
	controllers: [SubscriptionsController],
	exports: [SubscriptionsRepository, SubscriptionTokensService],
})
export class SubscriptionsModule {}
