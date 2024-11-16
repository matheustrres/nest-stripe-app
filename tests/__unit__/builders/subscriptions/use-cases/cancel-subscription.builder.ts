import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	CancelSubscriptionUseCaseInput,
	CancelSubscriptionUseCaseOutput,
} from '@/modules/subscriptions/application/use-cases/cancel-subscription.use-case';
import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';

import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';
import { SubscriptionStatusValueObjectBuilder } from '#/__unit__/builders/subscriptions/value-objects/subscription-status.builder';

export class CancelSubscriptionUseCaseBuilder {
	#input: CancelSubscriptionUseCaseInput = {
		userId: new EntityCuid().value,
	};

	getInput(): CancelSubscriptionUseCaseInput {
		return this.#input;
	}

	setUserId(userId: EntityCuid): this {
		this.#input.userId = userId.value;
		return this;
	}

	build(): CancelSubscriptionUseCaseOutput {
		return {
			subscription: new SubscriptionEntityBuilder()
				.setUserId(new EntityCuid(this.#input.userId))
				.setStatus(
					new SubscriptionStatusValueObjectBuilder()
						.setStatus(SubscriptionStatusEnum.Canceled)
						.build(),
				)
				.build(),
		};
	}
}
