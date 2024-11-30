import { Subscription } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';

import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import { SubscriptionStatusValueObject } from '@/modules/subscriptions/domain/value-objects/subscription-status';

export class PrismaSubscriptionMapper
	implements Mapper<SubscriptionEntity, Subscription>
{
	toDomain(model: Subscription): SubscriptionEntity {
		const status = new SubscriptionStatusValueObject(
			model.status as SubscriptionStatusEnum,
			model.createdAt,
		);

		return SubscriptionEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				userId: new EntityCuid(model.userId),
				status,
			},
			createdAt: model.createdAt,
		});
	}

	toPersist(entity: SubscriptionEntity): Subscription {
		const { status, userId, ...rest } = entity.getProps();

		return {
			id: entity.id.value,
			...rest,
			status: status.status.toString(),
			userId: userId.value,
			createdAt: entity.createdAt,
			updatedAt: new Date(),
		};
	}
}
