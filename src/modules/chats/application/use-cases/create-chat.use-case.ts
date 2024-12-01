import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { UseCase } from '@/@core/application/use-case';

import { ChatAlreadyExistsError } from '@/modules/chats/application/errors/chat-already-exists.error';
import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { ChatEntity } from '@/modules/chats/domain/chat.entity';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

export type CreateChatUseCaseInput = {
	name: string;
	userId: string;
	type: ChatTypeEnum;
};

export type CreateChatUseCaseOutput = {
	chat: ChatEntity;
};

@Injectable()
export class CreateChatUseCase
	implements UseCase<CreateChatUseCaseInput, CreateChatUseCaseOutput>
{
	constructor(
		private readonly chatsRepository: ChatsRepository,
		private readonly usersRepository: UsersRepository,
	) {}

	async exec({
		name,
		userId,
		type,
	}: CreateChatUseCaseInput): Promise<CreateChatUseCaseOutput> {
		const user = await this.usersRepository.findOne(userId);
		if (!user) {
			throw new InvalidCredentialsError();
		}

		const chatAlreadyExistsByName = await this.chatsRepository.findByName(name);
		if (chatAlreadyExistsByName) {
			throw ChatAlreadyExistsError.byName(name);
		}

		const chat = ChatEntity.createNew({
			name,
			ownerId: user.id,
			type,
		});

		await this.chatsRepository.upsert(chat);

		return {
			chat,
		};
	}
}
