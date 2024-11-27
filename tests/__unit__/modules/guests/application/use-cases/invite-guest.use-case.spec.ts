import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { EnvService } from '@/@core/config/env/env.service';
import { VendorCatalogProductSectionsEnum } from '@/@core/domain/constants/vendor-products-catalog';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { left, right } from '@/@core/domain/logic/either';
import { VendorProductsCatalogService } from '@/@core/domain/services/vendor-products-catalog.service';
import { NodeEnvEnum } from '@/@core/enums/node-env';
import { RoleEnum } from '@/@core/enums/user-role';

import { InvitesRepository } from '@/modules/guests/application/repositories/invites.repository';
import { InviteGuestUseCase } from '@/modules/guests/application/use-cases/invite-guest.use-case';
import {
	GuestInvitedDomainEvent,
	GuestInvitedDomainEventDataType,
} from '@/modules/guests/domain/events/guest-invited.event';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { InviteGuestUseCaseBuilder } from '#/__unit__/builders/guests/use-cases/invite-guest.builder';
import { SubscriptionEntityBuilder } from '#/__unit__/builders/subscriptions/subscription.builder';
import { VendorPlanBuilder } from '#/__unit__/builders/subscriptions/types/vendor-plan.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(InviteGuestUseCase.name, () => {
	let dateService: DateService;
	let envService: EnvService;
	let eventEmitter: EventEmitter;
	let usersRepository: UsersRepository;
	let invitesRepository: InvitesRepository;
	let productsCatalogService: VendorProductsCatalogService;
	let sut: InviteGuestUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: DateService,
					useValue: {
						now: jest.fn().mockResolvedValue(new Date()),
						addSeconds: jest.fn(),
					},
				},
				{
					provide: EnvService,
					useValue: {
						getKeyOrThrow: jest.fn(),
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
						countUserGuests: jest.fn(),
						findById: jest.fn(),
						findByEmail: jest.fn(),
					},
				},
				{
					provide: InvitesRepository,
					useValue: {
						upsert: jest.fn(),
					},
				},
				{
					provide: VendorProductsCatalogService,
					useValue: {
						getCatalogSessionProduct: jest.fn(),
					},
				},
				InviteGuestUseCase,
			],
		}).compile();

		dateService = moduleRef.get(DateService);
		envService = moduleRef.get(EnvService);
		eventEmitter = moduleRef.get(EventEmitter);
		usersRepository = moduleRef.get(UsersRepository);
		invitesRepository = moduleRef.get(InvitesRepository);
		productsCatalogService = moduleRef.get(VendorProductsCatalogService);
		sut = moduleRef.get(InviteGuestUseCase);
	});

	it('should be defined', () => {
		expect(dateService.now).toBeDefined();
		expect(dateService.addSeconds).toBeDefined();
		expect(envService.getKeyOrThrow).toBeDefined();
		expect(eventEmitter.emit).toBeDefined();
		expect(usersRepository.countUserGuests).toBeDefined();
		expect(usersRepository.findByEmail).toBeDefined();
		expect(usersRepository.findById).toBeDefined();
		expect(invitesRepository.upsert).toBeDefined();
		expect(productsCatalogService.getCatalogSessionProduct).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if no user is found with given {ownerId}', async () => {
		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(null);

		const input = new InviteGuestUseCaseBuilder().getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError(),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(input.ownerId, {
			relations: {
				subscription: true,
			},
		});
	});

	it('should throw a InvalidCredentialsError if user role is different than owner', async () => {
		const mockedUser = new UserEntityBuilder().setRole(RoleEnum.User).build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(mockedUser);

		const input = new InviteGuestUseCaseBuilder()
			.setOwnerId(mockedUser.id)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError('Not allowed.'),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(input.ownerId, {
			relations: {
				subscription: true,
			},
		});
	});

	it('should throw a InvalidCredentialsError if user has no subscription', async () => {
		const mockedUser = new UserEntityBuilder().setRole(RoleEnum.Owner).build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(mockedUser);

		const input = new InviteGuestUseCaseBuilder()
			.setOwnerId(mockedUser.id)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError('Not allowed.'),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(input.ownerId, {
			relations: {
				subscription: true,
			},
		});
	});

	it('should throw a UserAlreadyExistsError if given {guestEmail} is already in use', async () => {
		const mockedSubscription = new SubscriptionEntityBuilder().build();
		const mockedUser = new UserEntityBuilder()
			.setRole(RoleEnum.Owner)
			.setSubscription(mockedSubscription)
			.build();
		const guest = new UserEntityBuilder().setRole(RoleEnum.Guest).build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(mockedUser);
		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(guest);

		const input = new InviteGuestUseCaseBuilder()
			.setOwnerId(mockedUser.id)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			UserAlreadyExistsError.byEmail(input.guestEmail),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(input.ownerId, {
			relations: {
				subscription: true,
			},
		});
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.guestEmail);
	});

	it('should throw a SubscriptionNotFoundError if user current subscription is invalid', async () => {
		const mockedSubscription = new SubscriptionEntityBuilder().build();
		const mockedUser = new UserEntityBuilder()
			.setRole(RoleEnum.Owner)
			.setSubscription(mockedSubscription)
			.build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(mockedUser);
		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
		jest
			.spyOn(envService, 'getKeyOrThrow')
			.mockReturnValue(NodeEnvEnum.TESTING);
		jest
			.spyOn(productsCatalogService, 'getCatalogSessionProduct')
			.mockReturnValueOnce(left(null));

		const input = new InviteGuestUseCaseBuilder()
			.setOwnerId(mockedUser.id)
			.getInput();

		const { subscription: ownerSubscription } = mockedUser.getProps();
		const { vendorSubscriptionId, vendorProductId } =
			ownerSubscription!.getProps();

		await expect(sut.exec(input)).rejects.toThrow(
			SubscriptionNotFoundError.byCurrentSubscription(vendorSubscriptionId),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(input.ownerId, {
			relations: {
				subscription: true,
			},
		});
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.guestEmail);
		expect(
			productsCatalogService.getCatalogSessionProduct,
		).toHaveBeenCalledWith(
			VendorCatalogProductSectionsEnum.Plans,
			NodeEnvEnum.TESTING,
			vendorProductId,
		);
	});

	it('should invite a guest', async () => {
		const mockedSubscription = new SubscriptionEntityBuilder().build();
		const mockedUser = new UserEntityBuilder()
			.setRole(RoleEnum.Owner)
			.setSubscription(mockedSubscription)
			.build();
		const mockedVendorPlan = new VendorPlanBuilder()
			.setProdId(mockedSubscription.getProps().vendorProductId)
			.build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(mockedUser);
		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
		jest
			.spyOn(envService, 'getKeyOrThrow')
			.mockReturnValue(NodeEnvEnum.TESTING);
		jest
			.spyOn(productsCatalogService, 'getCatalogSessionProduct')
			.mockReturnValueOnce(right(mockedVendorPlan));
		jest.spyOn(invitesRepository, 'upsert');
		jest.spyOn(eventEmitter, 'emit');

		const input = new InviteGuestUseCaseBuilder()
			.setOwnerId(mockedUser.id)
			.getInput();

		const { subscription: ownerSubscription } = mockedUser.getProps();
		const { vendorProductId } = ownerSubscription!.getProps();

		const { invite } = await sut.exec(input);

		expect(usersRepository.findById).toHaveBeenCalledWith(input.ownerId, {
			relations: {
				subscription: true,
			},
		});
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.guestEmail);
		expect(
			productsCatalogService.getCatalogSessionProduct,
		).toHaveBeenCalledWith(
			VendorCatalogProductSectionsEnum.Plans,
			NodeEnvEnum.TESTING,
			vendorProductId,
		);
		expect(invitesRepository.upsert).toHaveBeenCalled();

		const eventEmitterEmitLastCallData = (
			(eventEmitter.emit as jest.Mock).mock
				.calls[0][0] as GuestInvitedDomainEvent
		).data;

		expect(eventEmitterEmitLastCallData).toMatchObject({
			name: input.guestName,
			email: input.guestEmail,
			inviteExpirationTimeInSeconds: 172_800,
			ownerId: mockedUser.id.value,
			// inviteId
			ownerName: mockedUser.getProps().name,
		} as GuestInvitedDomainEventDataType);
		expect(invite).toBeDefined();
		expect(invite.getProps().ownerId).toStrictEqual(mockedUser.id);
	});
});
