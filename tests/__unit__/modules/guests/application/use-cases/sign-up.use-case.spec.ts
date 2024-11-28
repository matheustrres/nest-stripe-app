import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { RoleEnum } from '@/@core/enums/user-role';
import { GuestSignUpTokenSubType, JwtPayload } from '@/@core/types';

import { GuestsRepository } from '@/modules/guests/application/repositories/guests.repository';
import { InvitesRepository } from '@/modules/guests/application/repositories/invites.repository';
import { GuestSignUpUseCase } from '@/modules/guests/application/use-cases/sign-up.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UsersService } from '@/modules/users/application/services/users.service';

import { GuestSignUpUseCaseBuilder } from '#/__unit__/builders/guests/use-cases/guest-sign-up.builder';

describe(GuestSignUpUseCase.name, () => {
	let guestsRepository: GuestsRepository;
	let invitesRepository: InvitesRepository;
	let tokenizationService: TokenizationService;
	let usersRepository: UsersRepository;
	let usersService: UsersService;
	let sut: GuestSignUpUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: DateService,
					useValue: {
						now: jest.fn().mockReturnValue(new Date()),
					},
				},
				{
					provide: GuestsRepository,
					useValue: {
						upsert: jest.fn(),
					},
				},
				{
					provide: InvitesRepository,
					useValue: {
						findOne: jest.fn(),
						upsert: jest.fn(),
					},
				},
				{
					provide: TokenizationService,
					useValue: {
						decode: jest.fn(),
						verify: jest.fn(),
					},
				},
				{
					provide: UsersRepository,
					useValue: {
						findByEmail: jest.fn(),
						findById: jest.fn(),
					},
				},
				{
					provide: UsersService,
					useValue: {
						createUser: jest.fn(),
					},
				},
				GuestSignUpUseCase,
			],
		}).compile();

		guestsRepository = moduleRef.get(GuestsRepository);
		invitesRepository = moduleRef.get(InvitesRepository);
		tokenizationService = moduleRef.get(TokenizationService);
		usersRepository = moduleRef.get(UsersRepository);
		usersService = moduleRef.get(UsersService);
		sut = moduleRef.get(GuestSignUpUseCase);
	});

	it('should be defined', () => {
		expect(guestsRepository.upsert).toBeDefined();
		expect(invitesRepository.findOne).toBeDefined();
		expect(invitesRepository.upsert).toBeDefined();
		expect(tokenizationService.decode).toBeDefined();
		expect(tokenizationService.verify).toBeDefined();
		expect(usersRepository.findByEmail).toBeDefined();
		expect(usersRepository.findById).toBeDefined();
		expect(usersService.createUser).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if given {token} is invalid', async () => {
		jest.spyOn(tokenizationService, 'verify').mockReturnValueOnce(false);

		const input = new GuestSignUpUseCaseBuilder()
			.setToken('invalid_jwt')
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			InvalidCredentialsError.byAuthenticationToken(),
		);
		expect(tokenizationService.verify).toHaveBeenCalledWith('invalid_jwt');
	});

	it('should throw a InvalidCredentialsError if token decoding returns invalid data', async () => {
		jest.spyOn(tokenizationService, 'verify').mockReturnValueOnce(true);
		jest
			.spyOn(tokenizationService, 'decode')
			.mockReturnValueOnce({} as JwtPayload);

		const input = new GuestSignUpUseCaseBuilder()
			.setToken('alternative_jwt')
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			InvalidCredentialsError.byAuthenticationToken(),
		);
		expect(tokenizationService.verify).toHaveBeenCalledWith('alternative_jwt');
		expect(tokenizationService.decode).toHaveBeenCalledWith('alternative_jwt');
	});

	it('should throw a InvalidCredentialsError if token sub decoding returns invalid data', async () => {
		jest.spyOn(tokenizationService, 'verify').mockReturnValueOnce(true);
		jest.spyOn(tokenizationService, 'decode').mockReturnValueOnce({
			role: RoleEnum.Guest,
			sub: '' as GuestSignUpTokenSubType,
		} as JwtPayload);

		const input = new GuestSignUpUseCaseBuilder()
			.setToken('alternative_jwt')
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			InvalidCredentialsError.byAuthenticationToken(),
		);
		expect(tokenizationService.verify).toHaveBeenCalledWith('alternative_jwt');
		expect(tokenizationService.decode).toHaveBeenCalledWith('alternative_jwt');
	});
});
