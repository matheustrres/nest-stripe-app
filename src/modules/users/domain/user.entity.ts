import { UserTokensValueObject } from './value-objects/tokens';

import { UserFreeTrialTokens } from '@/@core/domain/constants/tokens-per-plan';
import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { RoleEnum } from '@/@core/enums/user-role';
import { Optional } from '@/@core/types';

import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';

export type UserEntityProps = {
	name: string;
	email: string;
	password: string;
	role: RoleEnum;
	tokens: UserTokensValueObject;
	isAccountConfirmed: boolean;
	subscription?: SubscriptionEntity;
};

type OptionaUserEntityConstructorProps = Optional<
	UserEntityProps,
	'role' | 'tokens' | 'isAccountConfirmed'
>;
type UserEntityConstructorProps =
	CreateEntityProps<OptionaUserEntityConstructorProps>;
type UpdateUserEntityProps = Omit<
	Partial<UserEntityProps>,
	'isAccountConfirmed'
>;

export class UserEntity extends Entity<UserEntityProps> {
	private constructor({ id, props, createdAt }: UserEntityConstructorProps) {
		super({
			id,
			props: {
				...props,
				role: props.role ?? RoleEnum.User,
				tokens: props.tokens ?? new UserTokensValueObject(UserFreeTrialTokens),
				isAccountConfirmed: props.isAccountConfirmed ?? false,
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

	confirmAccount(): void {
		this.props.isAccountConfirmed = true;
	}
}
