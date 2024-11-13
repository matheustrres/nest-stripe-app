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

export type PlanDetails = {
	name: VendorPlanNameEnum;
	price: number;
	priceId: string;
	prodId: string;
	tokensPerCycle: number;
};

export type FullPlanDetails = PlanDetails & {
	level: VendorPlanLevelEnum;
	frequency: VendorPlanFrequencyEnum;
};

export type VendorPlansMapType = {
	[environment in NodeEnvEnum]: {
		[level in VendorPlanLevelEnum]: {
			[frequency in VendorPlanFrequencyEnum]: PlanDetails;
		};
	};
};

// Vendor = Stripe
export const VendorPlansMap: VendorPlansMapType = {
	[NodeEnvEnum.DEVELOPMENT]: {
		[VendorPlanLevelEnum.Essential]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.EssentialMonthly,
				price: 29.9,
				priceId: 'price_1QJLQ0P7QrM0bVUX4JFRP2Ty',
				prodId: 'prod_RBirDCtO3k153f',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				priceId: 'price_1QJLRSP7QrM0bVUXLLVADrvV',
				prodId: 'prod_RBitgXwWrWB2Fz',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				priceId: 'price_1QJLTOP7QrM0bVUXwbSIoCr6',
				prodId: 'prod_RBivZi1bPizyOZ',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				priceId: 'price_1QJLTtP7QrM0bVUXj08tRKUU',
				prodId: 'prod_RBiv5Fz54dq0ur',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				priceId: 'price_1QJLULP7QrM0bVUXz3OzYeRV',
				prodId: 'prod_RBiw9HlsG6vP3w',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				priceId: 'price_1QJLUwP7QrM0bVUXGYKaY3si',
				prodId: 'prod_RBiw9BI5PfTXS0',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				priceId: 'price_1QJLVMP7QrM0bVUXHRcs67nS',
				prodId: 'prod_RBixtKeGEZ6yxC',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				priceId: 'price_1QJLVoP7QrM0bVUXx9M0C6W5',
				prodId: 'prod_RBix8pfaOx43vH',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				priceId: 'price_1QJLWPP7QrM0bVUX38uYAVjb',
				prodId: 'prod_RBiyPW7WUWHH6I',
				tokensPerCycle: ExecutiveAnnualTokens,
			},
		},
	},
	[NodeEnvEnum.PRODUCTION]: {
		// Mantém como está (sem a propriedade priceId)
		[VendorPlanLevelEnum.Essential]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.EssentialMonthly,
				price: 29.9,
				priceId: 'price_1QKNKAP7QrM0bVUXJ84RGlYt',
				prodId: 'prod_RCmtabQ4sItL88',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				priceId: 'price_1QKNKbP7QrM0bVUXeekzXH8k',
				prodId: 'prod_RCmuPCPJiIpBM5',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				priceId: 'price_1QKNL5P7QrM0bVUXPR5JtcQK',
				prodId: 'prod_RCmu46rBJifzUT',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				priceId: 'price_1QKNMKP7QrM0bVUXwkqNtztQ',
				prodId: 'prod_RCmwkFdogeomzy',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				priceId: 'price_1QKNMlP7QrM0bVUXjQJIoAPZ',
				prodId: 'prod_RCmwrpkxUsWBUZ',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				priceId: 'price_1QKNNEP7QrM0bVUXfeavspbS',
				prodId: 'prod_RCmxYrItDzMoZv',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				priceId: 'price_1QKNNjP7QrM0bVUXpA0Yaj0A',
				prodId: 'prod_RCmxp2Eq07Uc0T',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				priceId: 'price_1QKNOEP7QrM0bVUXrgj4NvUB',
				prodId: 'prod_RCmyhyycds4szP',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				priceId: 'price_1QKNOlP7QrM0bVUXZrGAVXe4',
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
				priceId: 'price_1QJLQ0P7QrM0bVUX4JFRP2Ty',
				prodId: 'prod_RBirDCtO3k153f',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				priceId: 'price_1QJLRSP7QrM0bVUXLLVADrvV',
				prodId: 'prod_RBitgXwWrWB2Fz',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				priceId: 'price_1QJLTOP7QrM0bVUXwbSIoCr6',
				prodId: 'prod_RBivZi1bPizyOZ',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				priceId: 'price_1QJLTtP7QrM0bVUXj08tRKUU',
				prodId: 'prod_RBiv5Fz54dq0ur',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				priceId: 'price_1QJLULP7QrM0bVUXz3OzYeRV',
				prodId: 'prod_RBiw9HlsG6vP3w',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				priceId: 'price_1QJLUwP7QrM0bVUXGYKaY3si',
				prodId: 'prod_RBiw9BI5PfTXS0',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				priceId: 'price_1QJLVMP7QrM0bVUXHRcs67nS',
				prodId: 'prod_RBixtKeGEZ6yxC',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				priceId: 'price_1QJLVoP7QrM0bVUXx9M0C6W5',
				prodId: 'prod_RBix8pfaOx43vH',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				priceId: 'price_1QJLWPP7QrM0bVUX38uYAVjb',
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
				priceId: 'price_1QJLQ0P7QrM0bVUX4JFRP2Ty',
				prodId: 'prod_RBirDCtO3k153f',
				tokensPerCycle: EssentialMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.EssentialQuarterly,
				price: 79.9,
				priceId: 'price_1QJLRSP7QrM0bVUXLLVADrvV',
				prodId: 'prod_RBitgXwWrWB2Fz',
				tokensPerCycle: EssentialQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.EssentialAnnual,
				price: 289.9,
				priceId: 'price_1QJLTOP7QrM0bVUXwbSIoCr6',
				prodId: 'prod_RBivZi1bPizyOZ',
				tokensPerCycle: EssentialAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Professional]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ProfessionalMonthly,
				price: 89.9,
				priceId: 'price_1QJLTtP7QrM0bVUXj08tRKUU',
				prodId: 'prod_RBiv5Fz54dq0ur',
				tokensPerCycle: ProfessionalMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ProfessionalQuarterly,
				price: 239.9,
				priceId: 'price_1QJLULP7QrM0bVUXz3OzYeRV',
				prodId: 'prod_RBiw9HlsG6vP3w',
				tokensPerCycle: ProfessionalQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ProfessionalAnnual,
				price: 859.9,
				priceId: 'price_1QJLUwP7QrM0bVUXGYKaY3si',
				prodId: 'prod_RBiw9BI5PfTXS0',
				tokensPerCycle: ProfessionalAnnualTokens,
			},
		},
		[VendorPlanLevelEnum.Executive]: {
			[VendorPlanFrequencyEnum.Monthly]: {
				name: VendorPlanNameEnum.ExecutiveMonthly,
				price: 199.9,
				priceId: 'price_1QJLVMP7QrM0bVUXHRcs67nS',
				prodId: 'prod_RBixtKeGEZ6yxC',
				tokensPerCycle: ExecutiveMonthlyTokens,
			},
			[VendorPlanFrequencyEnum.Quarterly]: {
				name: VendorPlanNameEnum.ExecutiveQuarterly,
				price: 539.9,
				priceId: 'price_1QJLVoP7QrM0bVUXx9M0C6W5',
				prodId: 'prod_RBix8pfaOx43vH',
				tokensPerCycle: ExecutiveQuarterlyTokens,
			},
			[VendorPlanFrequencyEnum.Annual]: {
				name: VendorPlanNameEnum.ExecutiveAnnual,
				price: 1909.9,
				priceId: 'price_1QJLWPP7QrM0bVUX38uYAVjb',
				prodId: 'prod_RBiyPW7WUWHH6I',
				tokensPerCycle: ExecutiveAnnualTokens,
			},
		},
	},
};
