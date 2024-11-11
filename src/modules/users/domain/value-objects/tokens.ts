import { UserTokensError } from '@/modules/users/domain/errors/user-tokens.error';

export type UserTokensValueObjectProps = {
	readonly amount: number;
};

export class UserTokensValueObject implements UserTokensValueObjectProps {
	readonly amount!: number;

	static #validate({ amount }: UserTokensValueObjectProps): void {
		if (!amount || amount <= 0 || typeof amount !== 'number') {
			throw new UserTokensError(
				'Argument {amount} is required and must be a positive number.',
			);
		}
	}

	constructor(amount: number) {
		UserTokensValueObject.#validate({ amount });
		this.amount = amount;
	}

	addTokens(amount: number): UserTokensValueObject {
		UserTokensValueObject.#validate({ amount });
		return new UserTokensValueObject(amount);
	}

	subtractTokens(amount: number): UserTokensValueObject {
		UserTokensValueObject.#validate({ amount });
		if (this.amount < amount) throw UserTokensError.byInsufficientBalance();
		return new UserTokensValueObject(this.amount - amount);
	}

	hasSufficientBalance(amount: number): boolean {
		return this.amount >= amount;
	}

	equalsTo(instance: UserTokensValueObject): boolean {
		return this.amount === instance.amount;
	}
}
