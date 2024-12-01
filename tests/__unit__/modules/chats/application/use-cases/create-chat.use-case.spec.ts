import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';

import { ChatAlreadyExistsError } from '@/modules/chats/application/errors/chat-already-exists.error';
import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { CreateChatUseCase } from '@/modules/chats/application/use-cases/create-chat.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { ChatEntityBuilder } from '#/__unit__/builders/chats/chat.builder';
import { CreateChatUseCaseBuilder } from '#/__unit__/builders/chats/use-cases/create-chat.builder';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

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

	it('should throw a ChatAlreadyExistsError if a chat already exists with given {name}', async () => {
		const user = new UserEntityBuilder().build();
		const chat = new ChatEntityBuilder().build();

		jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
		jest.spyOn(chatsRepository, 'findByName').mockResolvedValueOnce(chat);

		const input = new CreateChatUseCaseBuilder()
			.setUserId(user.id.value)
			.getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			ChatAlreadyExistsError.byName(input.name),
		);
		expect(usersRepository.findOne).toHaveBeenCalledWith(input.userId);
		expect(chatsRepository.findByName).toHaveBeenCalledWith(input.name);
	});

	it('should create a Chat', async () => {
		const user = new UserEntityBuilder().build();

		jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(user);
		jest.spyOn(chatsRepository, 'findByName').mockResolvedValueOnce(null);
		jest.spyOn(chatsRepository, 'upsert');

		const input = new CreateChatUseCaseBuilder()
			.setUserId(user.id.value)
			.setName('QuickChat')
			.getInput();

		const { chat } = await sut.exec(input);

		expect(usersRepository.findOne).toHaveBeenCalledWith(input.userId);
		expect(chatsRepository.findByName).toHaveBeenCalledWith(input.name);
		expect(chatsRepository.upsert).toHaveBeenCalled();
		expect(chat).toBeDefined();
		expect(chat.getProps().name).toBe('QuickChat');
	});
});
