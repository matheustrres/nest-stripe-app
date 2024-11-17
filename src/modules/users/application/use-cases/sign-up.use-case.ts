import { Injectable } from '@nestjs/common';

import { CodeGenerationService } from '@/@core/application/services/code-gen.service';
import { HashingService } from '@/@core/application/services/hashing.service';
import { UseCase } from '@/@core/application/use-case';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { Role } from '@/@core/enums/user-role';

import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UserAccountCreatedDomainEvent } from '@/modules/users/domain/events/account-created.event';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type SignUpUseCaseInput = {
	name: string;
	email: string;
	password: string;
	role?: Role;
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
		private readonly eventEmitter: EventEmitter,
		private readonly codeGenService: CodeGenerationService,
	) {}

	async exec({
		name,
		email,
		password,
		role,
	}: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {
		const userAlreadyExistsByEmail =
			await this.usersRepository.findByEmail(email);
		if (userAlreadyExistsByEmail) throw UserAlreadyExistsError.byEmail(email);

		const hashedPassword = await this.hashingService.hash(password);
		const user = UserEntity.createNew({
			name,
			email,
			password: hashedPassword,
			role,
		});
		await this.usersRepository.upsert(user);

		const userProps = user.getProps();

		const authCode = await this.codeGenService.genAlphanumericCode(5);

		this.eventEmitter.emit(
			new UserAccountCreatedDomainEvent({
				name: userProps.name,
				email: userProps.email,
				code: authCode,
			}),
		);

		return {
			user,
		};
	}
}
