import { Role } from '@/@core/enums/user-role';

import { UserEntity } from '@/modules/users/domain/user.entity';

import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(UserEntity.name, () => {
	it('should create a new user', () => {
		const user = new UserEntityBuilder()
			.setName('John Doe')
			.setEmail('john.doe@gmail.com')
			.setTokens(1000)
			.build();

		const { name, email, role, tokens } = user.getProps();

		expect(user).toBeDefined();
		expect(name).toBe('John Doe');
		expect(email).toBe('john.doe@gmail.com');
		expect(role).toEqual(Role.User);
		expect(tokens.amount).toEqual(1000);
	});

	it('should restore a user', () => {
		const user = new UserEntityBuilder().build();
		const restoredUser = UserEntity.restore({
			id: user.id,
			props: user.getProps(),
			createdAt: user.createdAt,
		});
		expect(user).toStrictEqual(restoredUser);
	});

	it('should update a user', () => {
		const user = new UserEntityBuilder()
			.setName('John Doe')
			.setRole(Role.User)
			.build();

		expect(user.getProps().name).toBe('John Doe');
		expect(user.getProps().role).toBe('user');

		user.update({
			name: 'Adam Smith',
			role: Role.Admin,
		});

		expect(user.getProps().name).toBe('Adam Smith');
		expect(user.getProps().role).toBe('admin');
	});
});
