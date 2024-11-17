import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';

import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { ConfirmUserAccountUseCase } from '@/modules/users/application/use-cases/confirm-account.use-case';

import { ConfirmUserAccountUseCaseBuilder } from '#/__unit__/builders/users/use-cases/confirm-account.builder';

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
});
