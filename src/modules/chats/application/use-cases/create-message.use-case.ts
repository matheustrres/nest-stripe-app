import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { UseCase } from '@/@core/application/use-case';

import { ChatNotFoundError } from '@/modules/chats/application/errors/chat-not-found.error';
import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { MessagesRepository } from '@/modules/chats/application/repositories/messages.repository';
import { MessageEntity } from '@/modules/chats/domain/message.entity';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

export type CreateMessageUseCaseInput = {
	chatId: string;
	content: string;
	userId: string;
};

export type CreateMessageUseCaseOutput = {
	message: MessageEntity;
};

@Injectable()
export class CreateMessageUseCase
	implements UseCase<CreateMessageUseCaseInput, CreateMessageUseCaseOutput>
{
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly chatsRepository: ChatsRepository,
		private readonly messagesRepository: MessagesRepository,
	) {}

	async exec({
		chatId,
		content,
		userId,
	}: CreateMessageUseCaseInput): Promise<CreateMessageUseCaseOutput> {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new InvalidCredentialsError();
		}

		const chat = await this.chatsRepository.findByOwnerId(chatId, userId);
		if (!chat) {
			throw ChatNotFoundError.byId(chatId);
		}

		const message = MessageEntity.createNew({
			chatId: chat.id,
			content,
		});

		await this.messagesRepository.upsert(message);

		return {
			message,
		};
	}
}
