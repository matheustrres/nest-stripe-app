import { userDefaultTokensAmount } from '@/@core/domain/constants/user-tokens';

import { UserTokensValueObject } from '@/modules/users/domain/value-objects/tokens';

import { UserTokensValueObjectBuilder } from '#/__unit__/builders/users/value-objects/user-tokens.builder';

describe(UserTokensValueObject.name, () => {
	it('should throw if an invalid amount is provided', () => {
		expect(() =>
			new UserTokensValueObjectBuilder()
				.setAmount('10000' as unknown as number)
				.build(),
		).toThrow('Argument {amount} is required and must be a positive number.');
	});

	it('should create a new value object', () => {
		const tokens = new UserTokensValueObjectBuilder()
			.setAmount(userDefaultTokensAmount)
			.build();
		expect(tokens.amount).toEqual(1_000);
	});

	describe('when adding tokens', () => {
		it('should throw if an invalid amount is provided', () => {
			const tokens = new UserTokensValueObjectBuilder().build();
			expect(() => tokens.add('3_000' as unknown as number)).toThrow(
				'Argument {amount} is required and must be a positive number.',
			);
		});

		it('should sum up tokens', () => {
			const tokens = new UserTokensValueObjectBuilder()
				.setAmount(userDefaultTokensAmount)
				.build();
			tokens.add(3_000);
			expect(tokens.amount).toEqual(4_000);
		});
	});
});
