import {
	OptionaUserEntityConstructorProps,
	UserEntity,
} from '@/modules/users/domain/user.entity';

export abstract class UsersService {
	abstract createUser(
		props: OptionaUserEntityConstructorProps,
	): Promise<UserEntity>;
}
