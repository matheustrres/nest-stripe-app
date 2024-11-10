import {
	SignInUseCaseInput,
	SignInUseCaseOutput,
} from '@/modules/users/application/use-cases/sign-in.use-case';

import { FakerLib } from '#/__unit__/!libs/faker';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

export class SignInUseCaseBuilder {
	#input: SignInUseCaseInput = {
		email: FakerLib.internet.email(),
		password: FakerLib.internet.password(),
	};

	getInput(): SignInUseCaseInput {
		return this.#input;
	}

	setEmail(email: string): this {
		this.#input.email = email;
		return this;
	}

	setPassword(password: string): this {
		this.#input.password = password;
		return this;
	}

	build(): SignInUseCaseOutput {
		const { email, password } = this.getInput();

		return {
			accessToken: 'access_token',
			user: new UserEntityBuilder()
				.setEmail(email)
				.setPassword(password)
				.build(),
		};
	}
}
