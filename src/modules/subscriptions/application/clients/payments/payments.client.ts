import { VendorCustomersResource } from './resources/customers.resource';
import { VendorPaymentMethodsResource } from './resources/payment-methods.resource';
import { VendorSubscriptionsResource } from './resources/subscriptions.resource';

export abstract class VendorPaymentsClient {
	abstract customers: VendorCustomersResource;
	abstract paymentMethods: VendorPaymentMethodsResource;
	abstract subscriptions: VendorSubscriptionsResource;
}

export * from './resources/customers.resource';
export * from './resources/payment-methods.resource';
export * from './resources/subscriptions.resource';
