import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { EntityCuid } from '@/@core/domain/entity-cuid';

import { VendorPaymentsClient } from '@/modules/subscriptions/application/clients/payments/payments.client';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { CancelSubscriptionUseCase } from '@/modules/subscriptions/application/use-cases/cancel-subscription.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { CancelSubscriptionUseCaseBuilder } from '#/__unit__/builders/subscriptions/use-cases/cancel-subscription.builder';

describe(CancelSubscriptionUseCase.name, () => {
	let usersRepository: UsersRepository;
	let subscriptionsRepository: SubscriptionsRepository;
	let vendorPaymentsClient: VendorPaymentsClient;
	let sut: CancelSubscriptionUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: UsersRepository,
					useValue: {
						findById: jest.fn(),
					},
				},
				{
					provide: SubscriptionsRepository,
					useValue: {
						upsert: jest.fn(),
					},
				},
				{
					provide: VendorPaymentsClient,
					useValue: {
						subscriptions: {
							cancel: jest.fn(),
							findById: jest.fn(),
						},
					},
				},
				CancelSubscriptionUseCase,
			],
		}).compile();

		usersRepository = moduleRef.get(UsersRepository);
		subscriptionsRepository = moduleRef.get(SubscriptionsRepository);
		vendorPaymentsClient = moduleRef.get(VendorPaymentsClient);
		sut = moduleRef.get(CancelSubscriptionUseCase);
	});

	it('should be defined', () => {
		expect(usersRepository.findById).toBeDefined();
		expect(subscriptionsRepository.upsert).toBeDefined();
		expect(vendorPaymentsClient.subscriptions.cancel).toBeDefined();
		expect(vendorPaymentsClient.subscriptions.findById).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if no user is found with given {userId}', async () => {
		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(null);

		const userId = new EntityCuid();
		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(userId)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError(),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(userId.value, {
			relations: {
				subscription: true,
			},
		});
	});
});
