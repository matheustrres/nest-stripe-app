import { Test } from '@nestjs/testing';

import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { RoleEnum } from '@/@core/enums/user-role';

import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UsersService } from '@/modules/users/application/services/users.service';
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up.use-case';
import { UserAccountCreatedDomainEvent } from '@/modules/users/domain/events/account-created.event';

import { SignUpUseCaseBuilder } from '#/__unit__/builders/users/use-cases/sign-up.use-case.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(SignUpUseCase.name, () => {
	let alphanumericCodeService: AlphanumericCodeService;
	let eventEmitter: EventEmitter;
	let usersRepository: UsersRepository;
	let usersService: UsersService;
	let sut: SignUpUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: AlphanumericCodeService,
					useValue: {
						genCode: jest.fn(),
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
						findByEmail: jest.fn(),
						upsert: jest.fn(),
					},
				},
				{
					provide: UsersService,
					useValue: {
						createUser: jest.fn(),
					},
				},
				SignUpUseCase,
			],
		}).compile();

		alphanumericCodeService = moduleRef.get(AlphanumericCodeService);
		eventEmitter = moduleRef.get(EventEmitter);
		usersRepository = moduleRef.get(UsersRepository);
		usersService = moduleRef.get(UsersService);
		sut = moduleRef.get(SignUpUseCase);
	});

	it('should be defined', () => {
		expect(alphanumericCodeService.genCode).toBeDefined();
		expect(eventEmitter.emit).toBeDefined();
		expect(usersRepository.findByEmail).toBeDefined();
		expect(usersService.createUser).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a UserAlreadyExistsError if incoming email address is already in use', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(user);
		jest.spyOn(usersService, 'createUser');
		jest.spyOn(usersRepository, 'upsert');

		const { email } = user.getProps();

		const input = new SignUpUseCaseBuilder().setEmail(email).getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			UserAlreadyExistsError.byEmail(email),
		);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
		expect(usersService.createUser).not.toHaveBeenCalled();
		expect(usersRepository.upsert).not.toHaveBeenCalled();
	});

	it('should sign up a user', async () => {
		const user = new UserEntityBuilder()
			.setName('John Doe')
			.setEmail('jonh.doe@gmail.com')
			.setRole(RoleEnum.Owner)
			.build();
		const mockedAlphanumericCode = 'AB1C2';

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
		jest.spyOn(usersService, 'createUser').mockResolvedValueOnce(user);
		jest
			.spyOn(alphanumericCodeService, 'genCode')
			.mockResolvedValueOnce(mockedAlphanumericCode);

		const userProps = user.getProps();

		const input = new SignUpUseCaseBuilder()
			.setName(userProps.name)
			.setEmail(userProps.email)
			.setPassword('my_password')
			.setRole(userProps.role)
			.getInput();

		const { user: newUser } = await sut.exec(input);
		const newUserProps = newUser.getProps();

		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.email);
		expect(usersService.createUser).toHaveBeenCalledWith({
			name: userProps.name,
			email: userProps.email,
			password: 'my_password',
			role: RoleEnum.Owner,
		});
		expect(newUser).toBeDefined();
		expect(newUserProps.name).toEqual(userProps.name);
		expect(newUserProps.email).toEqual(userProps.email);
		expect(newUserProps.role).toBe(RoleEnum.Owner);
		expect(alphanumericCodeService.genCode).toHaveBeenCalledWith(5);
		expect(eventEmitter.emit).toHaveBeenCalledWith(
			expect.any(UserAccountCreatedDomainEvent),
		);

		const emittedEvent = (eventEmitter.emit as jest.Mock).mock
			.calls[0][0] as UserAccountCreatedDomainEvent;

		expect(emittedEvent.name).toBe('user.account_created');
		expect(emittedEvent.data).toMatchObject({
			name: userProps.name,
			email: userProps.email,
			code: mockedAlphanumericCode,
		});
	});
});
