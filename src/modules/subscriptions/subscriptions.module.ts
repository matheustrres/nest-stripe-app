import { AdaptersModule } from '@/infra/adapters/adapters.module';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { Module } from '@nestjs/common';

import { VendorPaymentsClient } from './application/clients/payments/payments.client';
import { SubscriptionsRepository } from './application/repositories/subscriptions.repository';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';
import { StripePaymentsClientAdapter } from './infra/adapters/services/payments/stripe.client';
import { PrismaSubscriptionsRepository } from './infra/drivers/database/subscriptions.repository';
import { SubscriptionsController } from './infra/drivers/http/rest/subscriptions.controller';

import { EnvService } from '@/@core/config/env/env.service';
import { NodeEnvEnum } from '@/@core/enums/node-env';

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
					apiVersion: '2024-10-28.acacia',
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
			useClass: StripePaymentsClientAdapter,
		},
		CreateSubscriptionUseCase,
	],
	controllers: [SubscriptionsController],
	exports: [SubscriptionsRepository],
})
export class SubscriptionsModule {}
