import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DomainEvent } from '@/@core/domain/events/domain-event';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';

@Injectable()
export class NestEventEmitterAdapter implements EventEmitter {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	emit<T = unknown>(domainEvent: DomainEvent<T>): boolean {
		return this.eventEmitter.emit(domainEvent.name, domainEvent);
	}

	async emitAsync<T = unknown>(
		domainEvent: DomainEvent<T>,
	): Promise<DomainEvent<T>> {
		return this.eventEmitter.emitAsync(
			domainEvent.name,
			domainEvent,
		) as unknown as DomainEvent<T>;
	}
}
