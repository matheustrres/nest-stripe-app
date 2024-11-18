import {
	FullVendorPlanDetails,
	VendorProductsCatalogMap,
} from '@/@core/domain/constants/vendor-products-catalog';
import { Either, left, right } from '@/@core/domain/logic/either';
import { NodeEnvEnum } from '@/@core/enums/node-env';
import {
	VendorPlanFrequencyEnum,
	VendorPlanLevelEnum,
	VendorPlanNameEnum,
} from '@/@core/enums/vendor-plan';

type GetPlanByProductIdResponseType = Either<null, FullVendorPlanDetails>;

export class VendorProductsCatalogDomainService {
	readonly #productsCatalog = VendorProductsCatalogMap;

	getPlanByProductId(productId: string): GetPlanByProductIdResponseType {
		const currentEnv = process.env['NODE_ENV'] as NodeEnvEnum;
		const envPlans = this.#productsCatalog.plans[currentEnv];

		for (const [level, frequencies] of Object.entries(envPlans)) {
			for (const [frequency, plan] of Object.entries(frequencies)) {
				if (plan.prodId === productId)
					return right({
						...plan,
						level: level as VendorPlanLevelEnum,
						frequency: frequency as VendorPlanFrequencyEnum,
					});
			}
		}

		return left(null);
	}

	getPlanLevel(planName: string | VendorPlanNameEnum): Either<null, string> {
		if (planName.includes(VendorPlanLevelEnum.Essential))
			return right(VendorPlanLevelEnum.Essential);
		if (planName.includes(VendorPlanLevelEnum.Executive))
			return right(VendorPlanLevelEnum.Executive);
		if (planName.includes(VendorPlanLevelEnum.Professional))
			return right(VendorPlanLevelEnum.Professional);
		return left(null);
	}
}
