import { CorePlansDomainService } from '@/@core/domain/services/plans.service';
import { VendorPlanNameEnum } from '@/@core/enums/vendor-plan';

describe(CorePlansDomainService.name, () => {
	let service: CorePlansDomainService;

	beforeEach(() => {
		service = new CorePlansDomainService();
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
		});
	});
});
