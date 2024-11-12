import { InvalidPlanDomainError } from '@/@core/domain/errors/invalid-plan.error';
import { CoreTokensDomainService } from '@/@core/domain/services/tokens.service';
import { VendorPlanNameEnum } from '@/@core/enums/vendor-plan';

describe(CoreTokensDomainService.name, () => {
	let service: CoreTokensDomainService;

	beforeEach(() => {
		service = new CoreTokensDomainService();
	});

	describe('.handleTokensByPlan()', () => {
		describe('when handling plan tokens', () => {
			it('should return an error if an invalid plan name is provided', () => {
				const handlingTokensResult = service.handleTokensByPlan(
					'Ess3nt1al' as VendorPlanNameEnum,
				);

				expect(handlingTokensResult.isLeft()).toBe(true);
				expect(handlingTokensResult.isRight()).toBe(false);
				expect(handlingTokensResult.value).toStrictEqual(
					new InvalidPlanDomainError(),
				);
			});

			it('should return plan tokens', () => {
				const handlingTokensResult = service.handleTokensByPlan(
					VendorPlanNameEnum.ExecutiveMonthly,
				);

				expect(handlingTokensResult.isLeft()).toBe(false);
				expect(handlingTokensResult.isRight()).toBe(true);
				expect(handlingTokensResult.value).toEqual(7_000);
			});
		});
	});
});
