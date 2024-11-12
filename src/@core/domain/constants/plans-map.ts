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
} from './tokens-per-plan';

import { NodeEnvEnum } from '@/@core/enums/node-env';
import {
	VendorPlanFrequencyEnum,
	VendorPlanLevelEnum,
	VendorPlanNameEnum,
} from '@/@core/enums/vendor-plan';

export type VendorPlansMapType = {
	[environment in NodeEnvEnum]: {
		[level in VendorPlanLevelEnum]: {
			[frequency in VendorPlanFrequencyEnum]: {
				name: VendorPlanNameEnum;
				price: number;
				prodId: string;
				tokensPerCycle: number;
			};
		};
	};
};

// Stripe products' ID's
export const VendorPlansMap: VendorPlansMapType = {
	[NodeEnvEnum.DEVELOPMENT]: {
		[VendorPlanLevelEnum.Essential]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.EssentialMonthly,
				price: 29.9,
				prodId: 'prod_RBirDCtO3k153f',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				prodId: 'prod_RBitgXwWrWB2Fz',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				prodId: 'prod_RBivZi1bPizyOZ',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				prodId: 'prod_RBiv5Fz54dq0ur',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				prodId: 'prod_RBiw9HlsG6vP3w',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				prodId: 'prod_RBiw9BI5PfTXS0',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				prodId: 'prod_RBixtKeGEZ6yxC',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				prodId: 'prod_RBix8pfaOx43vH',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				prodId: 'prod_RBiyPW7WUWHH6I',
				tokensPerCycle: ExecutiveAnnualTokens,
			},
		},
	},
	[NodeEnvEnum.PRODUCTION]: {
		[VendorPlanLevelEnum.Essential]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.EssentialMonthly,
				price: 29.9,
				prodId: 'prod_RCmtabQ4sItL88',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				prodId: 'prod_RCmuPCPJiIpBM5',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				prodId: 'prod_RCmu46rBJifzUT',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				prodId: 'prod_RCmwkFdogeomzy',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				prodId: 'prod_RCmwrpkxUsWBUZ',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				prodId: 'prod_RCmxYrItDzMoZv',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				prodId: 'prod_RCmxp2Eq07Uc0T',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				prodId: 'prod_RCmyhyycds4szP',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				prodId: 'prod_RCmyxYpnU49Qjd',
				tokensPerCycle: ExecutiveAnnualTokens,
			},
		},
	},
	[NodeEnvEnum.STAGING]: {
		[VendorPlanLevelEnum.Essential]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.EssentialMonthly,
				price: 29.9,
				prodId: 'prod_RBirDCtO3k153f',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				prodId: 'prod_RBitgXwWrWB2Fz',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				prodId: 'prod_RBivZi1bPizyOZ',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				prodId: 'prod_RBiv5Fz54dq0ur',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				prodId: 'prod_RBiw9HlsG6vP3w',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				prodId: 'prod_RBiw9BI5PfTXS0',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				prodId: 'prod_RBixtKeGEZ6yxC',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				prodId: 'prod_RBix8pfaOx43vH',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				prodId: 'prod_RBiyPW7WUWHH6I',
				tokensPerCycle: ExecutiveAnnualTokens,
			},
		},
	},
	[NodeEnvEnum.TESTING]: {
		[VendorPlanLevelEnum.Essential]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.EssentialMonthly,
				price: 29.9,
				prodId: 'prod_RBirDCtO3k153f',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				prodId: 'prod_RBitgXwWrWB2Fz',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				prodId: 'prod_RBivZi1bPizyOZ',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				prodId: 'prod_RBiv5Fz54dq0ur',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				prodId: 'prod_RBiw9HlsG6vP3w',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				prodId: 'prod_RBiw9BI5PfTXS0',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				prodId: 'prod_RBixtKeGEZ6yxC',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				prodId: 'prod_RBix8pfaOx43vH',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				prodId: 'prod_RBiyPW7WUWHH6I',
				tokensPerCycle: ExecutiveAnnualTokens,
			},
		},
	},
};
