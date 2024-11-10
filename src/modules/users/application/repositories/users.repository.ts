import { Repository } from '@/@core/application/repository';

import { UserEntity } from '@/modules/users/domain/user.entity';

export abstract class UsersRepository extends Repository<UserEntity> {
	abstract findByEmail(email: string): Promise<UserEntity | null>;
}
