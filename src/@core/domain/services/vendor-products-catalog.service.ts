import {
	FullVendorPlanDetails,
	VendorProductsCatalogMap,
	VendorCatalogProductSectionsEnum,
} from '@/@core/domain/constants/vendor-products-catalog';
import { Either, left, right } from '@/@core/domain/logic/either';
import { NodeEnvEnum } from '@/@core/enums/node-env';
import {
	VendorPlanFrequencyEnum,
	VendorPlanLevelEnum,
} from '@/@core/enums/vendor-plan';

export class VendorProductsCatalogService {
	readonly #productsCatalog = VendorProductsCatalogMap;

	getCatalogSessionProduct(
		section: VendorCatalogProductSectionsEnum,
		environment: NodeEnvEnum,
		productId: string,
	): Either<null, FullVendorPlanDetails> {
		if (!this.#productsCatalog[section]) return left(null);

		const environmentSectionProducts =
			this.#productsCatalog[section][environment];
		if (!environmentSectionProducts) return left(null);

		switch (section) {
			case VendorCatalogProductSectionsEnum.Plans:
				return this.#getPlanByProductId(environment, productId);
			default:
				return left(null);
		}
	}

	#getPlanByProductId(
		environment: NodeEnvEnum,
		productId: string,
	): Either<null, FullVendorPlanDetails> {
		const environmentPlans = this.#productsCatalog['plans'][environment];
		if (!environmentPlans) return left(null);

		for (const [level, frequencies] of Object.entries(environmentPlans)) {
			for (const [frequency, plan] of Object.entries(frequencies)) {
				if (plan.prodId === productId) {
					return right({
						...plan,
						level: level as VendorPlanLevelEnum,
						frequency: frequency as VendorPlanFrequencyEnum,
					});
				}
			}
		}

		return left(null);
	}
}
