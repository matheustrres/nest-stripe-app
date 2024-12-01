import { Test } from '@nestjs/testing';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';

import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { MessagesRepository } from '@/modules/chats/application/repositories/messages.repository';
import { CreateMessageUseCase } from '@/modules/chats/application/use-cases/create-message.use-case';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

import { CreateMessageUseCaseBuilder } from '#/__unit__/builders/chats/use-cases/create-message.builder';

describe(CreateMessageUseCase.name, () => {
	let usersRepository: UsersRepository;
	let chatsRepository: ChatsRepository;
	let messagesRepository: MessagesRepository;
	let sut: CreateMessageUseCase;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				{
					provide: UsersRepository,
					useValue: {
						findById: jest.fn(),
					},
				},
				{
					provide: ChatsRepository,
					useValue: {
						findByOwnerId: jest.fn(),
					},
				},
				{
					provide: MessagesRepository,
					useValue: {
						upsert: jest.fn(),
					},
				},
				CreateMessageUseCase,
			],
		}).compile();

		usersRepository = moduleRef.get(UsersRepository);
		chatsRepository = moduleRef.get(ChatsRepository);
		messagesRepository = moduleRef.get(MessagesRepository);
		sut = moduleRef.get(CreateMessageUseCase);
	});

	it('should be defined', () => {
		expect(usersRepository.findById).toBeDefined();
		expect(chatsRepository.findByOwnerId).toBeDefined();
		expect(messagesRepository.upsert).toBeDefined();
		expect(sut.exec).toBeDefined();
	});

	it('should throw a InvalidCredentialsError if no user is found with given {userId}', async () => {
		jest.spyOn(usersRepository, 'findById').mockResolvedValueOnce(null);

		const input = new CreateMessageUseCaseBuilder().getInput();

		await expect(sut.exec(input)).rejects.toThrow(
			new InvalidCredentialsError(),
		);
		expect(usersRepository.findById).toHaveBeenCalledWith(input.userId);
	});
});
