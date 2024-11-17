import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';
import { UseCase } from '@/@core/application/use-case';
import { SignUpContextKey } from '@/@core/domain/constants/code-context';

import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

export type ConfirmUserAccountUseCaseInput = {
	code: string;
	email: string;
};

export type ConfirmUserAccountUseCaseOutput = void;

@Injectable()
export class ConfirmUserAccountUseCase
	implements
		UseCase<ConfirmUserAccountUseCaseInput, ConfirmUserAccountUseCaseOutput>
{
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly alphanumericCodeService: AlphanumericCodeService,
	) {}

	async exec({
		code,
		email,
	}: ConfirmUserAccountUseCaseInput): Promise<ConfirmUserAccountUseCaseOutput> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) throw new InvalidCredentialsError();

		const codeMatches = await this.alphanumericCodeService.validateCode(
			SignUpContextKey,
			email,
			code,
		);
		if (!codeMatches) throw InvalidCredentialsError.byValidationCode();

		user.confirmAccount();

		await this.usersRepository.upsert(user);
	}
}
