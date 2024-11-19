export enum UserDomainEventsEnum {
	AccountCreated = 'user.account_created',
}

export enum SubscriptionDomainEventsEnum {
	RefundFailed = 'subscription.refund_failed',
	RefundRequest = 'subscription.refund_request',
}

export type DomainEventsEnum =
	| UserDomainEventsEnum
	| SubscriptionDomainEventsEnum;
