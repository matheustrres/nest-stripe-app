import { UserTokensValueObjectBuilder } from './value-objects/user-tokens.builder';

import { Role } from '@/@core/enums/user-role';

import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import {
	UserEntity,
	UserEntityOptionalProps,
} from '@/modules/users/domain/user.entity';

import { FakerLib } from '#/__unit__/!libs/faker';

export class UserEntityBuilder {
	#props: UserEntityOptionalProps = {
		name: FakerLib.person.fullName(),
		email: FakerLib.internet.email(),
		password: FakerLib.internet.password(),
		role: Role.User,
	};

	getProps(): UserEntityOptionalProps {
		return this.#props;
	}

	setName(name: string): this {
		this.#props.name = name;
		return this;
	}

	setEmail(email: string): this {
		this.#props.email = email;
		return this;
	}

	setPassword(password: string): this {
		this.#props.password = password;
		return this;
	}

	setRole(role: Role): this {
		this.#props.role = role;
		return this;
	}

	setTokens(tokens: number): this {
		this.#props.tokens = new UserTokensValueObjectBuilder()
			.setAmount(tokens)
			.build();
		return this;
	}

	setSubscription(subscription: SubscriptionEntity): this {
		this.#props.subscription = subscription;
		return this;
	}

	confirmAccount(): this {
		this.#props.isAccountConfirmed = true;
		return this;
	}

	build(): UserEntity {
		return UserEntity.createNew(this.#props);
	}
}
