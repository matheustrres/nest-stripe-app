import { ExecutiveMonthlyTokens } from '@/@core/domain/constants/tokens-per-plan';
import { FullVendorPlanDetails } from '@/@core/domain/constants/vendor-products-catalog';
import {
	VendorPlanFrequencyEnum,
	VendorPlanLevelEnum,
	VendorPlanNameEnum,
} from '@/@core/enums/vendor-plan';

export class VendorPlanBuilder {
	#props: FullVendorPlanDetails = {
		name: VendorPlanNameEnum.ExecutiveMonthly,
		frequency: VendorPlanFrequencyEnum.Monthly,
		level: VendorPlanLevelEnum.Executive,
		price: 199.9,
		priceId: 'price_1QJLVMP7QrM0bVUXHRcs67nS',
		prodId: 'prod_RBixtKeGEZ6yxC',
		tokensPerCycle: ExecutiveMonthlyTokens,
	};

	getProps(): FullVendorPlanDetails {
		return this.#props;
	}

	setName(name: VendorPlanNameEnum): this {
		this.#props.name = name;
		return this;
	}

	setFrequency(frequency: VendorPlanFrequencyEnum): this {
		this.#props.frequency = frequency;
		return this;
	}

	setLevel(level: VendorPlanLevelEnum): this {
		this.#props.level = level;
		return this;
	}

	setPrice(price: number): this {
		this.#props.price = price;
		return this;
	}

	setPriceId(priceId: string): this {
		this.#props.priceId = priceId;
		return this;
	}

	setProdId(prodId: string): this {
		this.#props.prodId = prodId;
		return this;
	}

	setTokensPerCycle(tokens: number): this {
		this.#props.tokensPerCycle = tokens;
		return this;
	}

	build(): FullVendorPlanDetails {
		return this.getProps();
	}
}
