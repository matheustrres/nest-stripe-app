import {
	GuestSignUpUseCaseInput,
	GuestSignUpUseCaseOutput,
} from '@/modules/guests/application/use-cases/sign-up.use-case';

import { FakerLib } from '#/__unit__/!libs/faker';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

export class GuestSignUpUseCaseBuilder {
	#input: GuestSignUpUseCaseInput = {
		name: FakerLib.person.fullName(),
		password: FakerLib.internet.password(),
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ3Vlc3QiLCJzdWIiOiJlSEZqTUhGdGVESnlkbXR6Y1had2VERnliMll4WjJoa09uRXlNbmx0ZFhBMGRtTjZOM0ZyT0RKM01uWXpNVzB6TXpwMGIzSnlaWE50YVhKaGJtUmhMbkpxUUdkdFlXbHNMbU52YlE9PSIsImlhdCI6MTczMjc0NDA2MCwiZXhwIjoxNzMyOTE2ODYwfQ.RmyaogouBwRoYlgfR7KMfnMfM2jYoBiB_M_J2Dwqb8A',
	};

	getInput(): GuestSignUpUseCaseInput {
		return this.#input;
	}

	setName(name: string): this {
		this.#input.name = name;
		return this;
	}

	setPassword(password: string): this {
		this.#input.password = password;
		return this;
	}

	setToken(token: string): this {
		this.#input.token = token;
		return this;
	}

	build(): GuestSignUpUseCaseOutput {
		const { name, password } = this.#input;

		return {
			user: new UserEntityBuilder().setName(name).setPassword(password).build(),
		};
	}
}
