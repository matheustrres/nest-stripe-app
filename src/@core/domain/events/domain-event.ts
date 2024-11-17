import { DomainEventsEnum } from '@/@core/enums/domain-events';

export class DomainEvent<T = unknown> {
	readonly data: T;
	readonly name: DomainEventsEnum;
	readonly createdAt = new Date();

	constructor(data: T, name: DomainEventsEnum) {
		this.data = data;
		this.name = name;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}
}
