import { CorePlansDomainService } from '@/@core/domain/services/plans.service';

describe(CorePlansDomainService.name, () => {
	let service: CorePlansDomainService;

	beforeEach(() => {
		service = new CorePlansDomainService();
	});

	describe('when looking up for a plan level', () => {
		it('should return null for an invalid plan name', () => {
			const planLevelFindingResult = service.getPlanLevel('Pr0fess1ion4l');

			expect(planLevelFindingResult.isLeft()).toBe(true);
			expect(planLevelFindingResult.value).toBe(null);
		});
	});
});
