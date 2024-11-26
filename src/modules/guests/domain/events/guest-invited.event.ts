import { DomainEvent } from '@/@core/domain/events/domain-event';
import { GuestDomainEventsEnum } from '@/@core/enums/domain-events';

export type GuestInvitedDomainEventDataType = {
	name: string;
	email: string;
};

export class GuestInvitedDomainEvent extends DomainEvent<GuestInvitedDomainEventDataType> {
	constructor(data: GuestInvitedDomainEventDataType) {
		super(data, GuestDomainEventsEnum.Invited);
	}
}
