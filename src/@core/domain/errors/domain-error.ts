export class DomainError extends Error {
	readonly message!: string;

	constructor(message: string) {
		super(message);

		this.message = message;
		Error.captureStackTrace(this, this.constructor);
	}
}
