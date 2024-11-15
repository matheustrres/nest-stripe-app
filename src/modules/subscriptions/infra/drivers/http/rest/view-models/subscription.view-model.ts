import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';

export type SubscriptionHttpResponse = {
	id: string;
	userId: string;
	vendorSubscriptionId: string;
	vendorCustomerId: string;
	vendorProductId: string;
	status: string;
	createdAt: Date;
};

export class SubscriptionViewModel {
	static toHttp(subscription: SubscriptionEntity): SubscriptionHttpResponse {
		const {
			status,
			userId,
			vendorCustomerId,
			vendorProductId,
			vendorSubscriptionId,
		} = subscription.getProps();

		return {
			id: subscription.id.value,
			userId: userId.value,
			vendorSubscriptionId,
			vendorCustomerId,
			vendorProductId,
			status: status.status,
			createdAt: subscription.createdAt,
		};
	}
}
