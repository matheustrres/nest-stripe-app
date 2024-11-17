import {
	ConfirmUserAccountUseCaseInput,
	ConfirmUserAccountUseCaseOutput,
} from '@/modules/users/application/use-cases/confirm-account.use-case';

import { FakerLib } from '#/__unit__/!libs/faker';

export class ConfirmUserAccountUseCaseBuilder {
	#input: ConfirmUserAccountUseCaseInput = {
		code: 'AB1C2',
		email: FakerLib.internet.email(),
	};

	getInput(): ConfirmUserAccountUseCaseInput {
		return this.#input;
	}

	setAlphanumericCode(code: string): this {
		this.#input.code = code;
		return this;
	}

	setEmail(email: string): this {
		this.#input.email = email;
		return this;
	}

	build(): ConfirmUserAccountUseCaseOutput {
		return;
	}
}
