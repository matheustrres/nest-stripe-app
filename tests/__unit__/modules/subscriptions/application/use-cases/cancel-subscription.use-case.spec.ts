import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { left } from '@/@core/domain/logic/either';

import { VendorPaymentsClient } from '@/modules/subscriptions/application/clients/payments/payments.client';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { CancelSubscriptionUseCase } from '@/modules/subscriptions/application/use-cases/cancel-subscription.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';
import { CancelSubscriptionUseCaseBuilder } from '#/__unit__/builders/subscriptions/use-cases/cancel-subscription.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

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

	it('should throw a SubscriptionNotFoundError if user has no subscription', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);

		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			SubscriptionNotFoundError.byUser(user.id.value),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(user.id.value, {
			relations: {
				subscription: true,
			},
		});
	});

	it("should throw a SubscriptionNotFoundError if no vendor subscription is found with user's subscription {vendorSubscriptionId}", async () => {
		const userBuilder = new UserEntityBuilder();
		const subscriptionBuilder = new SubscriptionEntityBuilder();
		let user = userBuilder.build();
		subscriptionBuilder.setUserId(user.id);
		const subscription = subscriptionBuilder.build();
		userBuilder.setSubscription(subscription);
		user = userBuilder.build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'findById')
			.mockResolvedValueOnce(left(null));

		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		const { vendorSubscriptionId } = subscription.getProps();

		await expect(sut.exec(input)).rejects.toThrow(
			SubscriptionNotFoundError.byCurrentVendorSubscription(
				vendorSubscriptionId,
			),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(user.id.value, {
			relations: {
				subscription: true,
			},
		});
		expect(vendorPaymentsClient.subscriptions.findById).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
	});
});
