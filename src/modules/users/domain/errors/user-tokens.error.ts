import { DomainError } from '@/@core/domain/errors/domain-error';

export class UserTokensError extends DomainError {
	constructor(message: string) {
		super(message);
	}

	static byInsufficientBalance() {
		return new UserTokensError('Insufficient tokens balance.');
	}
}
