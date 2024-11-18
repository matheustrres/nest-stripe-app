import { UserFreeTrialTokens } from '@/@core/domain/constants/tokens-per-plan';

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
			.setAmount(UserFreeTrialTokens)
			.build();
		expect(tokens.amount).toEqual(500);
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
				.setAmount(UserFreeTrialTokens)
				.build();
			tokens.add(3_000);
			expect(tokens.amount).toEqual(3_500);
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

	describe('when comparing tokens balance', () => {
		it('should throw if an invalid amount is provided', () => {
			const tokens = new UserTokensValueObjectBuilder().build();
			expect(() =>
				tokens.hasSufficientBalance('12_000' as unknown as number),
			).toThrow('Argument {amount} is required and must be a positive number.');
		});

		it('should compare if tokens balance is sufficient', () => {
			const tokens = new UserTokensValueObjectBuilder()
				.setAmount(10_000)
				.build();
			expect(tokens.hasSufficientBalance(8_340)).toBe(true);
			expect(tokens.hasSufficientBalance(13_000)).toBe(false);
			expect(tokens.hasSufficientBalance(34_490)).toBe(false);
			expect(tokens.hasSufficientBalance(2_920)).toBe(true);
		});
	});
});
