import { userDefaultTokensAmount } from '@/@core/domain/constants/user-tokens';

import { UserTokensValueObject } from '@/modules/users/domain/value-objects/tokens';

describe(UserTokensValueObject.name, () => {
	it('should throw if an invalid amount is provided', () => {
		expect(
			() => new UserTokensValueObject('10000' as unknown as number),
		).toThrow('Argument {amount} is required and must be a positive number.');
	});

	it('should create a new value object', () => {
		const tokens = new UserTokensValueObject(userDefaultTokensAmount);
		expect(tokens.amount).toEqual(1_000);
	});
});
