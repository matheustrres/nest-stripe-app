import { DomainError } from '@/@core/domain/errors/domain-error';
import { VendorPlanLevelEnum } from '@/@core/enums/vendor-plan';

export class SubscriptionPolicyViolationError extends DomainError {
	constructor(message: string) {
		super(message);
	}

	static byInvalidSubscription(): SubscriptionPolicyViolationError {
		return new SubscriptionPolicyViolationError('Invalid subscription.');
	}

	static forbiddenResourceForPlan(
		planLevel: VendorPlanLevelEnum,
	): SubscriptionPolicyViolationError {
		return new SubscriptionPolicyViolationError(
			`This resource is forbidden for plan ${planLevel.toString()}.`,
		);
	}
}
