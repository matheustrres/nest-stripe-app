import {
	EssentialAnnualTokens,
	EssentialMonthlyTokens,
	EssentialQuarterlyTokens,
	ExecutiveAnnualTokens,
	ExecutiveMonthlyTokens,
	ExecutiveQuarterlyTokens,
	ProfessionalAnnualTokens,
	ProfessionalMonthlyTokens,
	ProfessionalQuarterlyTokens,
} from '@/@core/domain/constants/tokens-per-plan';
import { InvalidPlanDomainError } from '@/@core/domain/errors/invalid-plan.error';
import { Either, left, right } from '@/@core/domain/logic/either';
import { VendorPlanNameEnum } from '@/@core/enums/vendor-plan';

type PlanTokensMap = Record<VendorPlanNameEnum, number>;

export class CoreTokensDomainService {
	static readonly #PLAN_TOKENS_MAP: PlanTokensMap = {
		[VendorPlanNameEnum.EssentialMonthly]: EssentialMonthlyTokens,
		[VendorPlanNameEnum.EssentialQuarterly]: EssentialQuarterlyTokens,
		[VendorPlanNameEnum.EssentialAnnual]: EssentialAnnualTokens,
		[VendorPlanNameEnum.ProfessionalMonthly]: ProfessionalMonthlyTokens,
		[VendorPlanNameEnum.ProfessionalQuarterly]: ProfessionalQuarterlyTokens,
		[VendorPlanNameEnum.ProfessionalAnnual]: ProfessionalAnnualTokens,
		[VendorPlanNameEnum.ExecutiveMonthly]: ExecutiveMonthlyTokens,
		[VendorPlanNameEnum.ExecutiveQuarterly]: ExecutiveQuarterlyTokens,
		[VendorPlanNameEnum.ExecutiveAnnual]: ExecutiveAnnualTokens,
	};

	handleTokensByPlan(
		planName: VendorPlanNameEnum,
	): Either<InvalidPlanDomainError, number> {
		const planTokens = CoreTokensDomainService.#PLAN_TOKENS_MAP[planName];
		if (!planTokens) return left(new InvalidPlanDomainError());
		return right(planTokens);
	}
}
