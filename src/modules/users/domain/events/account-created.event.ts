import { DomainEvent } from '@/@core/domain/events/domain-event';
import { UserDomainEventsEnum } from '@/@core/enums/domain-events';

export type UserAccountCreatedDomainEventDataType = {
	name: string;
	email: string;
	code: string;
};

export class UserAccountCreatedDomainEvent extends DomainEvent<UserAccountCreatedDomainEventDataType> {
	constructor(data: UserAccountCreatedDomainEventDataType) {
		super(data, UserDomainEventsEnum.AccountCreated);
	}
}
