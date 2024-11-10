import { Role } from '@/@core/enums/user-role';

import {
	UserEntity,
	UserEntityProps,
} from '@/modules/users/domain/user.entity';

import { faker } from '#/__unit__/!libs/faker';

export class UserEntityBuilder {
	#props: UserEntityProps = {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		role: Role.User,
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

	build(): UserEntity {
		return UserEntity.createNew(this.#props);
	}
}
