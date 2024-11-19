import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { left, right } from '@/@core/domain/logic/either';

import {
	VendorPaymentsClient,
	VendorSubscriptionStatusEnum,
} from '@/modules/subscriptions/application/clients/payments/payments.client';
import { InvalidSubscriptionActionError } from '@/modules/subscriptions/application/errors/invalid-subscription-action.error';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { CancelSubscriptionUseCase } from '@/modules/subscriptions/application/use-cases/cancel-subscription.use-case';
import { SubscriptionStatusEnum } from '@/modules/subscriptions/domain/enums/subscription-status';
import { RefundSubscriptionDomainEvent } from '@/modules/subscriptions/domain/events/refund-subscription.event';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';
import { VendorSubscriptionBuilder } from '#/__unit__/builders/subscriptions/types/vendor-subscription.builder';
import { CancelSubscriptionUseCaseBuilder } from '#/__unit__/builders/subscriptions/use-cases/cancel-subscription.builder';
import { SubscriptionStatusValueObjectBuilder } from '#/__unit__/builders/subscriptions/value-objects/subscription-status.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(CancelSubscriptionUseCase.name, () => {
	let dateService: DateService;
	let eventEmitter: EventEmitter;
	let subscriptionsRepository: SubscriptionsRepository;
	let usersRepository: UsersRepository;
	let vendorPaymentsClient: VendorPaymentsClient;
	let sut: CancelSubscriptionUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: DateService,
					useValue: {
						fromUnixTimestamp: jest.fn(),
						now: jest.fn(),
						differenceInDays: jest.fn(),
					},
				},
				{
					provide: EventEmitter,
					useValue: {
						emit: jest.fn(),
					},
				},
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

		dateService = moduleRef.get(DateService);
		eventEmitter = moduleRef.get(EventEmitter);
		usersRepository = moduleRef.get(UsersRepository);
		subscriptionsRepository = moduleRef.get(SubscriptionsRepository);
		vendorPaymentsClient = moduleRef.get(VendorPaymentsClient);
		sut = moduleRef.get(CancelSubscriptionUseCase);
	});

	it('should be defined', () => {
		expect(dateService.differenceInDays).toBeDefined();
		expect(dateService.fromUnixTimestamp).toBeDefined();
		expect(dateService.now).toBeDefined();
		expect(eventEmitter.emit).toBeDefined();
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
		const subscription = new SubscriptionEntityBuilder().build();

		const user = userBuilder.setSubscription(subscription).build();

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

	// when subscription status is active and vendor subscription status is canceled
	it("should sync subscription status and throw a InvalidSubscriptionActionError if user's subscription is already canceled", async () => {
		const vendorActiveSubscription = new VendorSubscriptionBuilder()
			.setStatus(VendorSubscriptionStatusEnum.Canceled)
			.build();
		const userBuilder = new UserEntityBuilder();
		const subscription = new SubscriptionEntityBuilder()
			.setStatus(
				new SubscriptionStatusValueObjectBuilder()
					.setStatus(SubscriptionStatusEnum.Active)
					.build(),
			)
			.setVendorSubscriptionId(vendorActiveSubscription.id)
			.build();

		const user = userBuilder.setSubscription(subscription).build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'findById')
			.mockResolvedValueOnce(right(vendorActiveSubscription));

		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		const { vendorSubscriptionId, status: previousStatus } =
			subscription.getProps();

		expect(previousStatus.isActive()).toBe(true);
		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidSubscriptionActionError(
				'Only active subscriptions can be canceled',
			),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(user.id.value, {
			relations: {
				subscription: true,
			},
		});
		expect(subscription.getProps().status.isActive()).toBe(false);
		expect(subscription.getProps().status.isCanceled()).toBe(true);
		expect(subscriptionsRepository.upsert).toHaveBeenCalled();
		expect(vendorPaymentsClient.subscriptions.findById).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
	});

	it("should throw a InvalidSubscriptionActionError if an error occurs when canceling user's subscription", async () => {
		const vendorActiveSubscription = new VendorSubscriptionBuilder()
			.setStatus(VendorSubscriptionStatusEnum.Active)
			.build();
		const userBuilder = new UserEntityBuilder();
		const subscription = new SubscriptionEntityBuilder()
			.setStatus(
				new SubscriptionStatusValueObjectBuilder()
					.setStatus(SubscriptionStatusEnum.Active)
					.build(),
			)
			.setVendorSubscriptionId(vendorActiveSubscription.id)
			.build();

		const user = userBuilder.setSubscription(subscription).build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'findById')
			.mockResolvedValueOnce(right(vendorActiveSubscription));
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'cancel')
			.mockResolvedValueOnce(left(null));

		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		const { vendorSubscriptionId } = subscription.getProps();

		await expect(sut.exec(input)).rejects.toThrow(
			InvalidSubscriptionActionError.byCancelingSubscription(),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(user.id.value, {
			relations: {
				subscription: true,
			},
		});
		expect(vendorPaymentsClient.subscriptions.findById).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
		expect(vendorPaymentsClient.subscriptions.cancel).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
	});

	it("should cancel user's subscription", async () => {
		jest.spyOn(dateService, 'differenceInDays').mockReturnValueOnce(14);

		const vendorActiveSubscription = new VendorSubscriptionBuilder()
			.setStatus(VendorSubscriptionStatusEnum.Active)
			.build();
		const userBuilder = new UserEntityBuilder();
		const subscription = new SubscriptionEntityBuilder()
			.setStatus(
				new SubscriptionStatusValueObjectBuilder()
					.setStatus(SubscriptionStatusEnum.Active)
					.build(),
			)
			.setVendorSubscriptionId(vendorActiveSubscription.id)
			.build();
		const user = userBuilder.setSubscription(subscription).build();
		const vendorCanceledSubscription = new VendorSubscriptionBuilder()
			.setStatus(VendorSubscriptionStatusEnum.Canceled)
			.build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'findById')
			.mockResolvedValueOnce(right(vendorActiveSubscription));
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'cancel')
			.mockResolvedValueOnce(right(vendorCanceledSubscription));
		jest.spyOn(subscriptionsRepository, 'upsert');

		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		const { vendorSubscriptionId } = subscription.getProps();

		const { subscription: canceledSubscription } = await sut.exec(input);
		const {
			status: canceledSubscriptionStatus,
			userId: canceledSubscriptionUserId,
			vendorSubscriptionId: canceledSubscriptionVendorSubscriptionId,
		} = canceledSubscription.getProps();

		expect(canceledSubscriptionStatus.isActive()).toBe(false);
		expect(canceledSubscriptionUserId).toStrictEqual(user.id);
		expect(canceledSubscriptionVendorSubscriptionId).toStrictEqual(
			vendorActiveSubscription.id,
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(user.id.value, {
			relations: {
				subscription: true,
			},
		});
		expect(vendorPaymentsClient.subscriptions.findById).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
		expect(vendorPaymentsClient.subscriptions.cancel).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
		expect(subscriptionsRepository.upsert).toHaveBeenCalled();
	});

	it("should cancel user's subscription and emit a RefundSubscriptionDomainEvent if subscription is refundable", async () => {
		const vendorActiveSubscription = new VendorSubscriptionBuilder()
			.setStatus(VendorSubscriptionStatusEnum.Active)
			.build();
		const userBuilder = new UserEntityBuilder();
		const subscription = new SubscriptionEntityBuilder()
			.setStatus(
				new SubscriptionStatusValueObjectBuilder()
					.setStatus(SubscriptionStatusEnum.Active)
					.build(),
			)
			.setVendorSubscriptionId(vendorActiveSubscription.id)
			.build();
		const user = userBuilder.setSubscription(subscription).build();
		const vendorCanceledSubscription = new VendorSubscriptionBuilder()
			.setStatus(VendorSubscriptionStatusEnum.Canceled)
			.build();

		const nowDateMocked = new Date();

		jest.spyOn(dateService, 'differenceInDays').mockReturnValueOnce(2);
		jest.spyOn(dateService, 'now').mockReturnValueOnce(nowDateMocked);
		jest.spyOn(eventEmitter, 'emit');
		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'findById')
			.mockResolvedValueOnce(right(vendorActiveSubscription));
		jest
			.spyOn(vendorPaymentsClient.subscriptions, 'cancel')
			.mockResolvedValueOnce(right(vendorCanceledSubscription));
		jest.spyOn(subscriptionsRepository, 'upsert');

		const { name, email } = user.getProps();

		const input = new CancelSubscriptionUseCaseBuilder()
			.setUserId(user.id)
			.getInput();

		const { vendorSubscriptionId } = subscription.getProps();

		const { subscription: canceledSubscription } = await sut.exec(input);
		const {
			status: canceledSubscriptionStatus,
			userId: canceledSubscriptionUserId,
			vendorSubscriptionId: canceledSubscriptionVendorSubscriptionId,
		} = canceledSubscription.getProps();

		expect(canceledSubscriptionStatus.isActive()).toBe(false);
		expect(canceledSubscriptionUserId).toStrictEqual(user.id);
		expect(canceledSubscriptionVendorSubscriptionId).toStrictEqual(
			vendorActiveSubscription.id,
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(user.id.value, {
			relations: {
				subscription: true,
			},
		});
		expect(vendorPaymentsClient.subscriptions.findById).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
		expect(vendorPaymentsClient.subscriptions.cancel).toHaveBeenCalledWith(
			vendorSubscriptionId,
		);
		expect(subscriptionsRepository.upsert).toHaveBeenCalled();
		expect(dateService.differenceInDays).toHaveBeenCalledWith({
			from: dateService.fromUnixTimestamp(vendorActiveSubscription.created),
			to: nowDateMocked,
		});

		const eventEmitterEmitLastCallData = (
			(eventEmitter.emit as jest.Mock).mock
				.calls[0][0] as RefundSubscriptionDomainEvent
		).data;

		expect(eventEmitterEmitLastCallData).toStrictEqual({
			subscriptionId: vendorCanceledSubscription.id,
			customerEmail: email,
			customerId: vendorCanceledSubscription.customer,
			customerName: name,
			subscriptionLatestInvoiceId:
				vendorActiveSubscription.latestInvoice as string,
		});
	});
});
