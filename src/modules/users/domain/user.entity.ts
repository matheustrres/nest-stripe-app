import { UserTokensValueObject } from './value-objects/tokens';

import { userDefaultTokensAmount } from '@/@core/domain/constants/user-tokens';
import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Role } from '@/@core/enums/user-role';
import { Optional } from '@/@core/types';

import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';

export type UserEntityProps = {
	name: string;
	email: string;
	password: string;
	role: Role;
	tokens: UserTokensValueObject;
	subscription?: SubscriptionEntity;
};

type OptionaUserEntityConstructorProps = Optional<
	UserEntityProps,
	'role' | 'tokens'
>;
type UserEntityConstructorProps =
	CreateEntityProps<OptionaUserEntityConstructorProps>;
type UpdateUserEntityProps = Partial<UserEntityProps>;

export class UserEntity extends Entity<UserEntityProps> {
	private constructor({ id, props, createdAt }: UserEntityConstructorProps) {
		super({
			id,
			props: {
				...props,
				role: props.role ?? Role.User,
				tokens:
					props.tokens ?? new UserTokensValueObject(userDefaultTokensAmount),
			},
			createdAt,
		});
	}

	static createNew(props: OptionaUserEntityConstructorProps): UserEntity {
		return new UserEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: UserEntityConstructorProps): UserEntity {
		return new UserEntity(props);
	}

	update(props: UpdateUserEntityProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
