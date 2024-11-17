import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';
import { SignUpContextKey } from '@/@core/domain/constants/code-context';

import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { ConfirmUserAccountUseCase } from '@/modules/users/application/use-cases/confirm-account.use-case';

import { ConfirmUserAccountUseCaseBuilder } from '#/__unit__/builders/users/use-cases/confirm-account.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

describe(ConfirmUserAccountUseCase.name, () => {
	let usersRepository: UsersRepository;
	let alphanumericCodeService: AlphanumericCodeService;
	let sut: ConfirmUserAccountUseCase;

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
					provide: AlphanumericCodeService,
					useValue: {
						validateCode: jest.fn(),
					},
				},
				ConfirmUserAccountUseCase,
			],
		}).compile();

		usersRepository = moduleRef.get(UsersRepository);
		alphanumericCodeService = moduleRef.get(AlphanumericCodeService);
		sut = moduleRef.get(ConfirmUserAccountUseCase);
	});

	it('should be defined', () => {
		expect(usersRepository.findByEmail).toBeDefined();
		expect(usersRepository.upsert).toBeDefined();
		expect(alphanumericCodeService.validateCode).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if no user is found with given {email}', async () => {
		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);

		const input = new ConfirmUserAccountUseCaseBuilder().getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError(),
		);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(input.email);
	});

	it('should throw a InvalidCredentialsError if given {code} does not match sign up code associated with given {email}', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(user);
		jest
			.spyOn(alphanumericCodeService, 'validateCode')
			.mockResolvedValueOnce(false);

		const { email } = user.getProps();

		const input = new ConfirmUserAccountUseCaseBuilder()
			.setEmail(email)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			InvalidCredentialsError.byValidationCode(),
		);
		expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
		expect(alphanumericCodeService.validateCode).toHaveBeenCalledWith(
			SignUpContextKey,
			email,
			input.code,
		);
	});

	it('should confirm user account', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(user);
		jest
			.spyOn(alphanumericCodeService, 'validateCode')
			.mockResolvedValueOnce(true);

		const { email } = user.getProps();

		const mockedAlphanumericCode = 'EF2G1';
		const input = new ConfirmUserAccountUseCaseBuilder()
			.setEmail(email)
			.setAlphanumericCode(mockedAlphanumericCode)
			.getInput();

		await sut.exec(input);

		expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
		expect(alphanumericCodeService.validateCode).toHaveBeenCalledWith(
			SignUpContextKey,
			email,
			mockedAlphanumericCode,
		);
		expect(usersRepository.upsert).toHaveBeenCalledWith(user);
		expect(user.getProps().isAccountConfirmed).toBe(true);
	});
});
