import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { CorePlansDomainService } from '@/@core/domain/services/vendor-plans.service';
import { CoreTokensDomainService } from '@/@core/domain/services/vendor-tokens.service';

import { VendorPaymentsClient } from '@/modules/subscriptions/application/clients/payments/payments.client';
import { SubscriptionAlreadyExistsError } from '@/modules/subscriptions/application/errors/subscription-already-exists.error';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { CreateSubscriptionUseCase } from '@/modules/subscriptions/application/use-cases/create-subscription.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';
import { CreateSubscriptionUseCaseBuilder } from '#/__unit__/builders/subscriptions/use-cases/create-subscription.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(CreateSubscriptionUseCase.name, () => {
	let corePlansDomainService: CorePlansDomainService;
	let coreTokensDomainService: CoreTokensDomainService;
	let usersRepository: UsersRepository;
	let subscriptionsRepository: SubscriptionsRepository;
	let vendorPaymentsClient: VendorPaymentsClient;
	let sut: CreateSubscriptionUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: CorePlansDomainService,
					useValue: {
						getPlanByProductId: jest.fn(),
					},
				},
				{
					provide: CoreTokensDomainService,
					useValue: {
						handleTokensByPlan: jest.fn(),
					},
				},
				{
					provide: UsersRepository,
					useValue: {
						findOne: jest.fn(),
						update: jest.fn(),
					},
				},
				{
					provide: SubscriptionsRepository,
					useValue: {
						findByUserId: jest.fn(),
						insert: jest.fn(),
					},
				},
				{
					provide: VendorPaymentsClient,
					useValue: {
						customers: {
							create: jest.fn(),
							delete: jest.fn(),
						},
						paymentMethods: {
							findById: jest.fn(),
						},
						subscriptions: {
							create: jest.fn(),
						},
					},
				},
				CreateSubscriptionUseCase,
			],
		}).compile();

		corePlansDomainService = moduleRef.get(CorePlansDomainService);
		coreTokensDomainService = moduleRef.get(CoreTokensDomainService);
		usersRepository = moduleRef.get(UsersRepository);
		subscriptionsRepository = moduleRef.get(SubscriptionsRepository);
		vendorPaymentsClient = moduleRef.get(VendorPaymentsClient);
		sut = moduleRef.get(CreateSubscriptionUseCase);
	});

	it('should be defined', () => {
		expect(corePlansDomainService.getPlanByProductId).toBeDefined();
		expect(coreTokensDomainService.handleTokensByPlan).toBeDefined();
		expect(usersRepository.findOne).toBeDefined();
		expect(usersRepository.update).toBeDefined();
		expect(subscriptionsRepository.findByUserId).toBeDefined();
		expect(subscriptionsRepository.insert).toBeDefined();
		expect(vendorPaymentsClient.customers.create).toBeDefined();
		expect(vendorPaymentsClient.customers.delete).toBeDefined();
		expect(vendorPaymentsClient.paymentMethods.findById).toBeDefined();
		expect(vendorPaymentsClient.subscriptions.create).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if no user is found with given {userId}', async () => {
		jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

		const input = new CreateSubscriptionUseCaseBuilder().getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError(),
		);
		expect(usersRepository.findOne).toHaveBeenCalledWith(input.userId);
	});

	it('should throw a SubscriptionAlreadyExistsError if user already has a subscription', async () => {
		const user = new UserEntityBuilder().build();
		const subscription = new SubscriptionEntityBuilder()
			.setUserId(user.id)
			.build();

		jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
		jest
			.spyOn(subscriptionsRepository, 'findByUserId')
			.mockResolvedValueOnce(subscription);

		const input = new CreateSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			SubscriptionAlreadyExistsError.byUser(input.userId),
		);
		expect(usersRepository.findOne).toHaveBeenCalledWith(input.userId);
		expect(subscriptionsRepository.findByUserId).toHaveBeenCalledWith(
			input.userId,
		);
	});
});
