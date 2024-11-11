import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';

import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';
import { SubscriptionStatusValueObjectBuilder } from '#/__unit__/builders/subscriptions/value-objects/subscription-status.builder';

describe(SubscriptionEntity.name, () => {
	it('should create a new subscription', () => {
		const subscriptionStatus = new SubscriptionStatusValueObjectBuilder()
			.setStatus(SubscriptionStatusEnum.Active)
			.build();
		const subscription = new SubscriptionEntityBuilder()
			.setStatus(subscriptionStatus)
			.setVendorCustomerId('customer_id')
			.build();

		const { status, vendorCustomerId } = subscription.getProps();

		expect(subscriptionStatus).toBeDefined();
		expect(subscription).toBeDefined();
		expect(status).toBe(subscriptionStatus);
		expect(status.isActive()).toBe(true);
		expect(vendorCustomerId).toBe('customer_id');
	});
});
