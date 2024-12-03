import { Subscription, User } from '@prisma/client';

import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Mapper } from '@/@core/domain/mapper';
import { Role } from '@/@core/enums/user-role';

import { PrismaSubscriptionMapper } from '@/modules/subscriptions/infra/drivers/database/subscription.mapper';
import { UserEntity } from '@/modules/users/domain/user.entity';
import { UserTokensValueObject } from '@/modules/users/domain/value-objects/tokens';

type MappingOptions = {
	relations?: {
		subscription?: Subscription | null;
	};
};

export class PrismaUserMapper implements Mapper<UserEntity, User> {
	toDomain(model: User, mappingOptions?: MappingOptions): UserEntity {
		const subscriptionToMap = mappingOptions?.relations?.subscription;

		return UserEntity.restore({
			id: new EntityCuid(model.id),
			props: {
				...model,
				role: model.role as Role,
				tokens: new UserTokensValueObject(model.tokens),
				...(!!subscriptionToMap && {
					subscription: new PrismaSubscriptionMapper().toDomain(
						subscriptionToMap,
					),
				}),
			},
			createdAt: model.createdAt,
		});
	}

	toPersist(entity: UserEntity): User {
		const { tokens, subscription, ...rest } = entity.getProps();

		return {
			id: entity.id.value,
			...rest,
			tokens: tokens.amount,
			createdAt: entity.createdAt,
			updatedAt: new Date(),
		};
	}
}
