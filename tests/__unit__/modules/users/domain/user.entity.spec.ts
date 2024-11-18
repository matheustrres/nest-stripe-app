import { UserFreeTrialTokens } from '@/@core/domain/constants/tokens-per-plan';
import { Role } from '@/@core/enums/user-role';

import { UserEntity } from '@/modules/users/domain/user.entity';

import { UserTokensValueObjectBuilder } from '#/__unit__/builders/users/value-objects/user-tokens.builder';

describe(UserEntity.name, () => {
	it('should create a new user', () => {
		const userTokens = new UserTokensValueObjectBuilder()
			.setAmount(UserFreeTrialTokens)
			.build();
		const user = UserEntity.createNew({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: 'youshallnotpass',
			tokens: userTokens,
		});
		const { name, email, role, tokens } = user.getProps();
		expect(user).toBeDefined();
		expect(name).toBe('John Doe');
		expect(email).toBe('john.doe@gmail.com');
		expect(role).toEqual(Role.User);
		expect(tokens.amount).toEqual(UserFreeTrialTokens);
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
