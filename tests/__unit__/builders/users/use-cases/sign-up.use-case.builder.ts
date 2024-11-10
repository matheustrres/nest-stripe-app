import {
	SignUpUseCaseInput,
	SignUpUseCaseOutput,
} from '@/modules/users/application/use-cases/sign-up.use-case';
import { UserEntity } from '@/modules/users/domain/user.entity';

import { faker } from '#/__unit__/!libs/faker';

export class SignUpUseCaseBuilder {
	#input: SignUpUseCaseInput = {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	};

	getInput(): SignUpUseCaseInput {
		return this.#input;
	}

	setName(name: string): this {
		this.#input.name = name;
		return this;
	}

	setEmail(email: string): this {
		this.#input.email = email;
		return this;
	}

	setPassword(password: string): this {
		this.#input.password = password;
		return this;
	}

	build(): SignUpUseCaseOutput {
		return {
			user: UserEntity.createNew(this.#input),
		};
	}
}
