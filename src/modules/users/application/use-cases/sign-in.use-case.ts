import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { HashingService } from '@/@core/application/services/hashing.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { UseCase } from '@/@core/application/use-case';

import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type SignInUseCaseInput = {
	email: string;
	password: string;
};

export type SignInUseCaseOutput = {
	accessToken: string;
	user: UserEntity;
};

@Injectable()
export class SignInUseCase
	implements UseCase<SignInUseCaseInput, SignInUseCaseOutput>
{
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashingService: HashingService,
		private readonly tokenizationService: TokenizationService,
	) {}

	async exec({
		email,
		password,
	}: SignInUseCaseInput): Promise<SignInUseCaseOutput> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) throw new InvalidCredentialsError();

		const { password: userPassword, role } = user.getProps();

		const passwordMatches = await this.hashingService.compare({
			hashedStr: userPassword,
			plainStr: password,
		});
		if (!passwordMatches) throw new InvalidCredentialsError();

		const accessToken = await this.tokenizationService.sign(
			{
				sub: user.id.value,
				role,
			},
			'2d',
		);
		return {
			accessToken,
			user,
		};
	}
}
