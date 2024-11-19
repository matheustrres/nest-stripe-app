import { Injectable } from '@nestjs/common';

export type RetryAttemptType = {
	attempts: number;
	nextRetry: Date;
};

@Injectable()
export class RetryService {
	readonly #retries = new Map<string, RetryAttemptType>();

	addRetry(key: string, attempts: number, delay: number): void {
		const nextRetry = new Date(Date.now() + delay);
		this.#retries.set(key, { attempts, nextRetry });
	}

	fetchRetry(key: string): RetryAttemptType {
		let retry = this.#retries.get(key);
		if (!retry) {
			retry = {
				attempts: 0,
				nextRetry: new Date(),
			};
		}
		return retry;
	}

	removeRetry(key: string): void {
		this.#retries.delete(key);
	}
}
