import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import { SubscriptionStatusValueObject } from '@/modules/subscriptions/domain/value-objects/subscription-status';

import { SubscriptionStatusValueObjectBuilder } from '#/__unit__/builders/subscriptions/value-objects/subscription-status.builder';

describe(SubscriptionStatusValueObject.name, () => {
	it('should create a SubscriptionStatus object', () => {
		const status = new SubscriptionStatusValueObjectBuilder()
			.setStatus(SubscriptionStatusEnum.Canceled)
			.build();

		expect(status).toBeDefined();
		expect(status.isActive()).toBe(false);
	});
});
