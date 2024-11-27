export enum GuestDomainEventsEnum {
	Invited = 'guest.invited',
}

export enum SubscriptionDomainEventsEnum {
	RefundFailed = 'subscription.refund_failed',
	RefundRequest = 'subscription.refund_request',
}

export enum UserDomainEventsEnum {
	AccountCreated = 'user.account_created',
}

export type DomainEventsEnum =
	| GuestDomainEventsEnum
	| SubscriptionDomainEventsEnum
	| UserDomainEventsEnum;
