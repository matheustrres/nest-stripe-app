import { OnEvent } from '@nestjs/event-emitter';

import { DomainEventsEnum } from '@/@core/enums/domain-events';

export function OnDomainEvent(eventName: DomainEventsEnum): MethodDecorator {
	return OnEvent(eventName.toString());
}
