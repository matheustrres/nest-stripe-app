import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { UseCase } from '@/@core/application/use-case';
import { EnvService } from '@/@core/config/env/env.service';
import { VendorCatalogProductSectionsEnum } from '@/@core/domain/constants/vendor-products-catalog';
import { VendorProductsCatalogService } from '@/@core/domain/services/vendor-products-catalog.service';

import { VendorPaymentsClient } from '@/modules/subscriptions/application/clients/payments/payments.client';
import { InvalidSubscriptionActionError } from '@/modules/subscriptions/application/errors/invalid-subscription-action.error';
import { SubscriptionAlreadyExistsError } from '@/modules/subscriptions/application/errors/subscription-already-exists.error';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import { SubscriptionStatusValueObject } from '@/modules/subscriptions/domain/value-objects/subscription-status';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UserTokensValueObject } from '@/modules/users/domain/value-objects/tokens';

export type CreateSubscriptionUseCaseInput = {
	userId: string;
	paymentMethodId: string;
	productId: string;
};

export type CreateSubscriptionUseCaseOutput = {
	subscription: SubscriptionEntity;
};

@Injectable()
export class CreateSubscriptionUseCase
	implements
		UseCase<CreateSubscriptionUseCaseInput, CreateSubscriptionUseCaseOutput>
{
	constructor(
		private readonly envService: EnvService,
		private readonly productsCatalogService: VendorProductsCatalogService,
		private readonly usersRepository: UsersRepository,
		private readonly subscriptionsRepository: SubscriptionsRepository,
		private readonly vendorPaymentsClient: VendorPaymentsClient,
	) {}

	async exec({
		userId,
		paymentMethodId,
		productId,
	}: CreateSubscriptionUseCaseInput): Promise<CreateSubscriptionUseCaseOutput> {
		const user = await this.usersRepository.findOne(userId);
		if (!user) throw new InvalidCredentialsError();

		const userAlreadyHasSubscription =
			await this.subscriptionsRepository.findByUserId(userId);
		if (userAlreadyHasSubscription)
			throw SubscriptionAlreadyExistsError.byUser(userId);

		const currentEnvironment = this.envService.getKeyOrThrow('NODE_ENV');

		const vendorPlanFindingResult =
			this.productsCatalogService.getCatalogSessionProduct(
				VendorCatalogProductSectionsEnum.Plans,
				currentEnvironment,
				productId,
			);
		if (vendorPlanFindingResult.isLeft())
			throw InvalidSubscriptionActionError.productNotFound(productId);

		const vendorPaymentMethodFindingResult =
			await this.vendorPaymentsClient.paymentMethods.findById(paymentMethodId);
		if (vendorPaymentMethodFindingResult.isLeft()) {
			throw InvalidSubscriptionActionError.paymentMethodNotFound(
				paymentMethodId,
			);
		}

		const { email } = user.getProps();
		const vendorPaymentMethod = vendorPaymentMethodFindingResult.value;

		const vendorCustomerCreationResult =
			await this.vendorPaymentsClient.customers.create(
				email,
				vendorPaymentMethod.id,
			);
		if (vendorCustomerCreationResult.isLeft())
			throw InvalidSubscriptionActionError.byCreatingCustomer();

		const vendorCustomer = vendorCustomerCreationResult.value;
		const vendorProduct = vendorPlanFindingResult.value;

		const vendorSubscriptionCreationResult =
			await this.vendorPaymentsClient.subscriptions.create(
				vendorCustomer.id,
				vendorProduct.priceId,
				vendorPaymentMethod.id,
			);
		if (vendorSubscriptionCreationResult.isLeft()) {
			await this.vendorPaymentsClient.customers.delete(vendorCustomer.id);
			throw InvalidSubscriptionActionError.byCreatingSubscription();
		}

		const vendorSubscription = vendorSubscriptionCreationResult.value;

		const subscriptionStatus = new SubscriptionStatusValueObject(
			SubscriptionStatusEnum.Active,
			new Date(),
		);

		const subscription = SubscriptionEntity.createNew({
			userId: user.id,
			status: subscriptionStatus,
			vendorCustomerId: vendorCustomer.id,
			vendorProductId: vendorProduct.prodId,
			vendorSubscriptionId: vendorSubscription.id,
		});

		await this.subscriptionsRepository.upsert(subscription);

		user.update({
			tokens: new UserTokensValueObject(vendorProduct.tokensPerCycle),
		});

		await this.usersRepository.upsert(user);

		return {
			subscription,
		};
	}
}
