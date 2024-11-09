import { Role } from '@/@core/enums/user-role';

import { UserEntity } from '@/modules/users/domain/user.entity';

describe(UserEntity.name, () => {
	it('should create a new user', () => {
		const user = UserEntity.createNew({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: 'youshallnotpass',
		});
		const { name, email, role } = user.getProps();
		expect(user).toBeDefined();
		expect(name).toBe('John Doe');
		expect(email).toBe('john.doe@gmail.com');
		expect(role).toEqual(Role.User);
	});

	it('should restore a user', () => {
		const user = UserEntity.createNew({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: 'youshallnotpass',
		});
		const restoredUser = UserEntity.restore({
			id: user.id,
			props: user.getProps(),
			createdAt: user.createdAt,
		});
		expect(user).toStrictEqual(restoredUser);
	});
});
