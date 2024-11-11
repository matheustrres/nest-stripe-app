import { userDefaultTokensAmount } from '@/@core/domain/constants/user-tokens';

import { UserTokensError } from '@/modules/users/domain/errors/user-tokens.error';
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

	describe('when subtracting tokens', () => {
		it('should throw if an invalid amount is provided', () => {
			const tokens = new UserTokensValueObjectBuilder().build();
			expect(() => tokens.subtract('3_000' as unknown as number)).toThrow(
				'Argument {amount} is required and must be a positive number.',
			);
		});

		it('should throw if current amount is less than the provided amount', () => {
			const tokens = new UserTokensValueObjectBuilder()
				.setAmount(10_000)
				.build();
			expect(() => tokens.subtract(13_400)).toThrow(
				UserTokensError.byInsufficientBalance(),
			);
		});

		it('should subtract tokens', () => {
			const tokens = new UserTokensValueObjectBuilder()
				.setAmount(15_000)
				.build();
			tokens.subtract(3_000);
			expect(tokens.amount).toEqual(12_000);
		});
	});
});
