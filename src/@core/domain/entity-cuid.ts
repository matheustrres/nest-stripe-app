import cuid2 from '@paralleldrive/cuid2';

import { UniqueId } from './unique-id';

export class EntityCuid implements UniqueId<EntityCuid> {
	readonly #value: NonNullable<string>;

	constructor(value?: string) {
		this.#value = value ?? cuid2.createId();
	}

	get value(): string {
		return this.#value;
	}

	equalsTo(id: EntityCuid): boolean {
		return this.toString() === id.toString();
	}
}
