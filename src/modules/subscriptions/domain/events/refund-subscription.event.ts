import { DomainEvent } from '@/@core/domain/events/domain-event';
import { SubscriptionDomainEventsEnum } from '@/@core/enums/domain-events';

export type RefundSubscriptionDomainEventDataType = {
	customerId: string;
	customerEmail: string;
	customerName: string;
	subscriptionId: string;
	subscriptionLatestInvoiceId: string;
};

export class RefundSubscriptionDomainEvent extends DomainEvent<RefundSubscriptionDomainEventDataType> {
	constructor(data: RefundSubscriptionDomainEventDataType) {
		super(data, SubscriptionDomainEventsEnum.RefundRequest);
	}
}
