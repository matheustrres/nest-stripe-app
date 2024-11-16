import { EntityCuid } from '../entity-cuid';

export abstract class DomainEvent<T = unknown> {
	readonly #id: EntityCuid;
	readonly #createdAt: Date;
	readonly #data: T;

	constructor(data: T) {
		this.#id = new EntityCuid();
		this.#createdAt = new Date();
		this.#data = data;
	}

	abstract getName(): string;

	getId(): EntityCuid {
		return this.#id;
	}

	getCreatedAt(): Date {
		return this.#createdAt;
	}

	getData(): T {
		return this.#data;
	}
}
