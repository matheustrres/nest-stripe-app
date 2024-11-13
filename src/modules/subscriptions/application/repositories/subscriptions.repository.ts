import { Repository } from '@/@core/application/repository';

import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';

export abstract class SubscriptionsRepository extends Repository<SubscriptionEntity> {
	abstract findByUserId(userId: string): Promise<SubscriptionEntity | null>;
}
