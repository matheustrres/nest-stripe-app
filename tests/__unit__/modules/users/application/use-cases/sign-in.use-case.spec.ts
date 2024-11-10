import { Test } from '@nestjs/testing';

import { HashingService } from '@/@core/application/services/hashing.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';

import { UserInvalidCredentialsError } from '@/modules/users/application/errors/user-invalid-credentials.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { SignInUseCase } from '@/modules/users/application/use-cases/sign-in.use-case';

import { SignInUseCaseBuilder } from '#/__unit__/builders/users/use-cases/sign-in.use-case.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(SignInUseCase.name, () => {
	let usersRepository: UsersRepository;
	let hashingService: HashingService;
	let tokenizationService: TokenizationService;
	let sut: SignInUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: UsersRepository,
					useValue: {
						findByEmail: jest.fn(),
					},
				},
				{
					provide: HashingService,
					useValue: {
						compare: jest.fn(),
					},
				},
				{
					provide: TokenizationService,
					useValue: {
						sign: jest.fn(),
					},
				},
				SignInUseCase,
			],
		}).compile();

		usersRepository = moduleRef.get(UsersRepository);
		hashingService = moduleRef.get(HashingService);
		tokenizationService = moduleRef.get(TokenizationService);
		sut = moduleRef.get(SignInUseCase);
	});

	it('should be defined', () => {
		expect(usersRepository.findByEmail).toBeDefined();
		expect(hashingService.compare).toBeDefined();
		expect(tokenizationService.sign).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a UserInvalidCredentialsError if incoming email address is invalid', async () => {
		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
		jest.spyOn(hashingService, 'compare');
		jest.spyOn(tokenizationService, 'sign');

		const input = new SignInUseCaseBuilder().getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new UserInvalidCredentialsError(),
		);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.email);
		expect(hashingService.compare).not.toHaveBeenCalled();
		expect(tokenizationService.sign).not.toHaveBeenCalled();
	});

	it('should throw a UserInvalidCredentialsError if incoming password does not match user hashed password', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(user);
		jest.spyOn(hashingService, 'compare').mockResolvedValueOnce(false);
		jest.spyOn(tokenizationService, 'sign');

		const { email, password } = user.getProps();

		const input = new SignInUseCaseBuilder().setEmail(email).getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new UserInvalidCredentialsError(),
		);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.email);
		expect(hashingService.compare).toHaveBeenCalledWith({
			hashedStr: password,
			plainStr: input.password,
		});
		expect(tokenizationService.sign).not.toHaveBeenCalled();
	});
});
