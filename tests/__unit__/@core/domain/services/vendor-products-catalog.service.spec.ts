import { VendorCatalogProductSectionsEnum } from '@/@core/domain/constants/vendor-products-catalog';
import { VendorProductsCatalogService } from '@/@core/domain/services/vendor-products-catalog.service';
import { NodeEnvEnum } from '@/@core/enums/node-env';

describe(VendorProductsCatalogService.name, () => {
	let service: VendorProductsCatalogService;

	const environment = NodeEnvEnum.TESTING;

	beforeEach(() => {
		service = new VendorProductsCatalogService();
	});

	describe('.getCatalogSessionProduct()', () => {
		describe('when looking up for a plan by its product id', () => {
			it('should return null for an invalid product id', () => {
				const planFindingResult = service.getCatalogSessionProduct(
					VendorCatalogProductSectionsEnum.Plans,
					environment,
					'prod_PXmxWlrItuTMoÇv',
				);

				expect(planFindingResult.isLeft()).toBe(true);
				expect(planFindingResult.isRight()).toBe(false);
				expect(planFindingResult.value).toBe(null);
			});

			it('should return full plan details', () => {
				const planFindingResult = service.getCatalogSessionProduct(
					VendorCatalogProductSectionsEnum.Plans,
					environment,
					'prod_RBitgXwWrWB2Fz',
				);

				expect(planFindingResult.isLeft()).toBe(false);
				expect(planFindingResult.isRight()).toBe(true);
				expect(planFindingResult.value).toStrictEqual({
					name: 'Essential Quarterly',
					level: 'Essential',
					frequency: 'Quarterly',
					price: 79.9,
					priceId: 'price_1QJLRSP7QrM0bVUXLLVADrvV',
					prodId: 'prod_RBitgXwWrWB2Fz',
					tokensPerCycle: 3_100,
				});
			});
		});
	});
});
