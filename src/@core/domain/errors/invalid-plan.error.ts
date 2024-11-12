import { DomainError } from './domain-error';

export class InvalidPlanDomainError extends DomainError {
	constructor() {
		super('Invalid plan.');
	}
}
