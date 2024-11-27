import { DomainEvent } from '@/@core/domain/events/domain-event';
import { GuestDomainEventsEnum } from '@/@core/enums/domain-events';

export type GuestInvitedDomainEventDataType = {
	inviteId: string;
	ownerId: string;
	ownerName: string;
	name: string;
	email: string;
	inviteExpirationTimeInSeconds: number;
};

export class GuestInvitedDomainEvent extends DomainEvent<GuestInvitedDomainEventDataType> {
	constructor(data: GuestInvitedDomainEventDataType) {
		super(data, GuestDomainEventsEnum.Invited);
	}
}
