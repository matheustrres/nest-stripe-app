import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';

import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { CreateChatUseCase } from '@/modules/chats/application/use-cases/create-chat.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { CreateChatUseCaseBuilder } from '#/__unit__/builders/chats/use-cases/create-chat.builder';

describe(CreateChatUseCase.name, () => {
	let chatsRepository: ChatsRepository;
	let usersRepository: UsersRepository;
	let sut: CreateChatUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: ChatsRepository,
					useValue: {
						findByName: jest.fn(),
						upsert: jest.fn(),
					},
				},
				{
					provide: UsersRepository,
					useValue: {
						findOne: jest.fn(),
					},
				},
				CreateChatUseCase,
			],
		}).compile();

		chatsRepository = moduleRef.get(ChatsRepository);
		usersRepository = moduleRef.get(UsersRepository);
		sut = moduleRef.get(CreateChatUseCase);
	});

	it('should be defined', () => {
		expect(chatsRepository.findByName).toBeDefined();
		expect(chatsRepository.upsert).toBeDefined();
		expect(usersRepository.findOne).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if no user is found with given {userId}', async () => {
		jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
		jest.spyOn(chatsRepository, 'findByName');

		const input = new CreateChatUseCaseBuilder().getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError(),
		);
		expect(usersRepository.findOne).toHaveBeenCalledWith(input.userId);
		expect(chatsRepository.findByName).not.toHaveBeenCalled();
	});
});
