import { UserTokensError } from '@/modules/users/domain/errors/user-tokens.error';

export type UserTokensValueObjectProps = {
	amount: number;
};

export class UserTokensValueObject implements UserTokensValueObjectProps {
	amount!: number;

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

	add(amount: number): void {
		UserTokensValueObject.#validate({ amount });
		this.amount += amount;
	}

	subtract(amount: number): void {
		UserTokensValueObject.#validate({ amount });
		if (this.amount < amount) throw UserTokensError.byInsufficientBalance();
		this.amount -= amount;
	}

	hasSufficientBalance(amount: number): boolean {
		UserTokensValueObject.#validate({ amount });
		return this.amount >= amount;
	}

	equalsTo(instance: UserTokensValueObject): boolean {
		return this.amount === instance.amount;
	}
}
