import { UserTokensValueObjectBuilder } from './value-objects/user-tokens.builder';

import { Role } from '@/@core/enums/user-role';

import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import {
	UserEntity,
	UserEntityProps,
} from '@/modules/users/domain/user.entity';

import { FakerLib } from '#/__unit__/!libs/faker';

export class UserEntityBuilder {
	#props: UserEntityProps = {
		name: FakerLib.person.fullName(),
		email: FakerLib.internet.email(),
		password: FakerLib.internet.password(),
		role: Role.User,
		tokens: new UserTokensValueObjectBuilder().build(),
	};

	getProps(): UserEntityProps {
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

	build(): UserEntity {
		return UserEntity.createNew(this.#props);
	}
}
