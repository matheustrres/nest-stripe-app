import {
	VendorPlansMap,
	VendorPlansMapType,
} from '@/@core/domain/constants/plans-map';
import { Either, left, right } from '@/@core/domain/logic/either';
import { NodeEnvEnum } from '@/@core/enums/node-env';
import {
	VendorPlanFrequencyEnum,
	VendorPlanLevelEnum,
	VendorPlanNameEnum,
} from '@/@core/enums/vendor-plan';

type PlanMapping = {
	name: VendorPlanNameEnum;
	level: VendorPlanLevelEnum;
	frequency: VendorPlanFrequencyEnum;
	price: number;
	prodId: string;
	tokensPerCycle: number;
};
type GetPlanByProductIdResponseType = Either<null, PlanMapping>;

export class CorePlansDomainService {
	readonly #plans: VendorPlansMapType = VendorPlansMap;

	getPlanLevel(planName: string | VendorPlanNameEnum): Either<null, string> {
		if (planName.includes(VendorPlanLevelEnum.Essential))
			return right(VendorPlanLevelEnum.Essential);
		if (planName.includes(VendorPlanLevelEnum.Executive))
			return right(VendorPlanLevelEnum.Executive);
		if (planName.includes(VendorPlanLevelEnum.Professional))
			return right(VendorPlanLevelEnum.Professional);

		return left(null);
	}

	getPlanByProductId(prodId: string): GetPlanByProductIdResponseType {
		const currentEnvironment = process.env['NODE_ENV'] as NodeEnvEnum;
		const environmentPlans = this.#plans[currentEnvironment];

		for (const [level, frequencies] of Object.entries(environmentPlans)) {
			for (const [frequency, plan] of Object.entries(frequencies)) {
				if (plan.prodId === prodId)
					return right({
						name: plan.name,
						level: level as VendorPlanLevelEnum,
						frequency: frequency as VendorPlanFrequencyEnum,
						price: plan.price,
						prodId: plan.prodId,
						tokensPerCycle: plan.tokensPerCycle,
					});
			}
		}

		return left(null);
	}
}
