import { faker } from '@faker-js/faker';

import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	CreateSubscriptionUseCaseInput,
	CreateSubscriptionUseCaseOutput,
} from '@/modules/subscriptions/application/use-cases/create-subscription.use-case';

import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';

export class CreateSubscriptionUseCaseBuilder {
	#input: CreateSubscriptionUseCaseInput = {
		paymentMethodId: faker.string.ulid(),
		productId: faker.string.ulid(),
		userId: new EntityCuid().value,
	};

	getInput(): CreateSubscriptionUseCaseInput {
		return this.#input;
	}

	setPaymentMethodId(paymentMethodId: string): this {
		this.#input.paymentMethodId = paymentMethodId;
		return this;
	}

	setProductId(productId: string): this {
		this.#input.productId = productId;
		return this;
	}

	setUserId(userId: EntityCuid): this {
		this.#input.userId = userId.value;
		return this;
	}

	build(): CreateSubscriptionUseCaseOutput {
		const { userId, productId } = this.getInput();
		return {
			subscription: new SubscriptionEntityBuilder()
				.setUserId(new EntityCuid(userId))
				.setVendorProductId(productId)
				.build(),
		};
	}
}
