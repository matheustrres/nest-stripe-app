import { VendorProductsCatalogDomainService } from '@/@core/domain/services/vendor-products-catalog.service';
import { VendorPlanNameEnum } from '@/@core/enums/vendor-plan';

describe(VendorProductsCatalogDomainService.name, () => {
	let service: VendorProductsCatalogDomainService;

	beforeEach(() => {
		service = new VendorProductsCatalogDomainService();
	});

	describe('.getPlanLevel()', () => {
		describe('when looking up for a plan level', () => {
			it('should return null for an invalid plan name', () => {
				const planLevelFindingResult = service.getPlanLevel('Pr0fess1ion4l');

				expect(planLevelFindingResult.isLeft()).toBe(true);
				expect(planLevelFindingResult.isRight()).toBe(false);
				expect(planLevelFindingResult.value).toBe(null);
			});

			it('should return the plan level', () => {
				const planLevelFindingResult = service.getPlanLevel(
					VendorPlanNameEnum.EssentialMonthly,
				);

				expect(planLevelFindingResult.isLeft()).toBe(false);
				expect(planLevelFindingResult.isRight()).toBe(true);
				expect(planLevelFindingResult.value).toBe('Essential');
			});
		});
	});

	describe('.getPlanByProductId()', () => {
		describe('when looking up for a plan by its product id', () => {
			it('should return null for an invalid product id', () => {
				const planFindingResult = service.getPlanByProductId(
					'prod_PXmxWlrItuTMoÇv',
				);

				expect(planFindingResult.isLeft()).toBe(true);
				expect(planFindingResult.isRight()).toBe(false);
				expect(planFindingResult.value).toBe(null);
			});

			it('should return full plan details', () => {
				const planFindingResult = service.getPlanByProductId(
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
