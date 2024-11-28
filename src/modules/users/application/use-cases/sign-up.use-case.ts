import { Injectable } from '@nestjs/common';

import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';
import { UseCase } from '@/@core/application/use-case';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { RoleEnum } from '@/@core/enums/user-role';

import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UserAccountCreatedDomainEvent } from '@/modules/users/domain/events/account-created.event';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type SignUpUseCaseInput = {
	name: string;
	email: string;
	password: string;
	role?: RoleEnum;
};

export type SignUpUseCaseOutput = {
	user: UserEntity;
};

@Injectable()
export class SignUpUseCase
	implements UseCase<SignUpUseCaseInput, SignUpUseCaseOutput>
{
	constructor(
		private readonly alphanumericCodeService: AlphanumericCodeService,
		private readonly eventEmitter: EventEmitter,
		private readonly usersRepository: UsersRepository,
		private readonly usersService: UsersService,
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

		const user = await this.usersService.createUser({
			name,
			email,
			password,
			role,
		});
		const userProps = user.getProps();

		const authCode = await this.alphanumericCodeService.genCode(5);

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
