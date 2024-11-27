import { Repository } from '@/@core/application/repository';

import { UserEntity } from '@/modules/users/domain/user.entity';

export type FindOptions = {
	relations?: {
		subscription?: boolean;
	};
};

export abstract class UsersRepository extends Repository<UserEntity> {
	abstract countUserGuests(userId: string): Promise<number>;
	abstract findById(
		id: string,
		findOptions?: FindOptions,
	): Promise<UserEntity | null>;
	abstract findByEmail(
		email: string,
		findOptions?: FindOptions,
	): Promise<UserEntity | null>;
}
