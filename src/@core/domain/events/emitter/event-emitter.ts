import { DomainEvent } from '@/@core/domain/events/domain-event';

export abstract class EventEmitter {
	abstract emit<T = unknown>(domainEvent: DomainEvent<T>): boolean;
	abstract emitAsync<T = unknown>(
		domainEvent: DomainEvent<T>,
	): Promise<DomainEvent<T>>;
}
