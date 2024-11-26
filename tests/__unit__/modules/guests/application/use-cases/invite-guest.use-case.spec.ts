import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { EnvService } from '@/@core/config/env/env.service';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { VendorProductsCatalogService } from '@/@core/domain/services/vendor-products-catalog.service';
import { RoleEnum } from '@/@core/enums/user-role';

import { InvitesRepository } from '@/modules/guests/application/repositories/invites.repository';
import { InviteGuestUseCase } from '@/modules/guests/application/use-cases/invite-guest.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { InviteGuestUseCaseBuilder } from '#/__unit__/builders/guests/use-cases/invite-guest.builder';
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
		const user = new UserEntityBuilder().setRole(RoleEnum.User).build();

		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(user);

		const input = new InviteGuestUseCaseBuilder()
			.setOwnerId(user.id)
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
});
