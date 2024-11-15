import { Test } from '@nestjs/testing';

import { HashingService } from '@/@core/application/services/hashing.service';

import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { SignUpUseCase } from '@/modules/users/application/use-cases/sign-up.use-case';

import { SignUpUseCaseBuilder } from '#/__unit__/builders/users/use-cases/sign-up.use-case.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(SignUpUseCase.name, () => {
	let usersRepository: UsersRepository;
	let hashingService: HashingService;
	let sut: SignUpUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: UsersRepository,
					useValue: {
						findByEmail: jest.fn(),
						upsert: jest.fn(),
					},
				},
				{
					provide: HashingService,
					useValue: {
						hash: jest.fn(),
					},
				},
				SignUpUseCase,
			],
		}).compile();

		usersRepository = moduleRef.get(UsersRepository);
		hashingService = moduleRef.get(HashingService);
		sut = moduleRef.get(SignUpUseCase);
	});

	it('should be defined', () => {
		expect(usersRepository).toBeDefined();
		expect(hashingService).toBeDefined();
		expect(sut).toBeDefined();
	});

	it('should throw a UserAlreadyExistsError if incoming email address is already in use', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(user);
		jest.spyOn(hashingService, 'hash');
		jest.spyOn(usersRepository, 'upsert');

		const { email } = user.getProps();

		const input = new SignUpUseCaseBuilder().setEmail(email).getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			UserAlreadyExistsError.byEmail(email),
		);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
		expect(hashingService.hash).not.toHaveBeenCalled();
		expect(usersRepository.upsert).not.toHaveBeenCalled();
	});

	it('should sign up a user', async () => {
		const user = new UserEntityBuilder().build();
		const hashedPassword = 'supersecrethashedpassword';

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
		jest.spyOn(hashingService, 'hash').mockResolvedValueOnce(hashedPassword);
		jest.spyOn(usersRepository, 'upsert');

		const userProps = user.getProps();

		const input = new SignUpUseCaseBuilder()
			.setName(userProps.name)
			.setEmail(userProps.email)
			.getInput();

		const { user: newUser } = await sut.exec(input);
		const newUserProps = newUser.getProps();

		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.email);
		expect(hashingService.hash).toHaveBeenCalledWith(input.password);
		expect(usersRepository.upsert).toHaveBeenCalled();
		expect(newUser).toBeDefined();
		expect(newUserProps.name).toEqual(userProps.name);
		expect(newUserProps.email).toEqual(userProps.email);
		expect(newUserProps.password).toBe(hashedPassword);
	});
});
