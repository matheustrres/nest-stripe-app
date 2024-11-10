import { Injectable } from '@nestjs/common';

import { HashingService } from '@/@core/application/services/hashing.service';
import { UseCase } from '@/@core/application/use-case';

import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type SignUpUseCaseInput = {
	name: string;
	email: string;
	password: string;
};

export type SignUpUseCaseOutput = {
	user: UserEntity;
};

@Injectable()
export class SignUpUseCase
	implements UseCase<SignUpUseCaseInput, SignUpUseCaseOutput>
{
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashingService: HashingService,
	) {}

	async exec({
		name,
		email,
		password,
	}: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {
		const userAlreadyExistsByEmail =
			await this.usersRepository.findByEmail(email);
		if (userAlreadyExistsByEmail) throw UserAlreadyExistsError.byEmail(email);

		const hashedPassword = await this.hashingService.hash(password);
		const user = UserEntity.createNew({
			name,
			email,
			password: hashedPassword,
		});
		await this.usersRepository.insert(user);

		return {
			user,
		};
	}
}
