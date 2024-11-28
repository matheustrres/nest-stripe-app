import { Injectable } from '@nestjs/common';

import { HashingService } from '@/@core/application/services/hashing.service';

import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UsersService } from '@/modules/users/application/services/users.service';
import {
	UserEntity,
	OptionaUserEntityConstructorProps,
} from '@/modules/users/domain/user.entity';

@Injectable()
export class UsersServiceAdapter implements UsersService {
	constructor(
		private readonly hashingService: HashingService,
		private readonly usersRepository: UsersRepository,
	) {}

	async createUser({
		name,
		email,
		password,
		role,
	}: OptionaUserEntityConstructorProps): Promise<UserEntity> {
		const hashedPassword = await this.hashingService.hash(password);
		const user = UserEntity.createNew({
			name,
			email,
			password: hashedPassword,
			role,
			isAccountConfirmed: true,
		});
		await this.usersRepository.upsert(user);
		return user;
	}
}
