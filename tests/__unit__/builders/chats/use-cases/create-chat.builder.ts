import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	CreateChatUseCaseInput,
	CreateChatUseCaseOutput,
} from '@/modules/chats/application/use-cases/create-chat.use-case';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

import { FakerLib } from '#/__unit__/!libs/faker';
import { ChatEntityBuilder } from '#/__unit__/builders/chats/chat.builder';

export class CreateChatUseCaseBuilder {
	#input: CreateChatUseCaseInput = {
		name: FakerLib.company.name(),
		type: ChatTypeEnum.ConsumerLaw,
		userId: new EntityCuid().value,
	};

	getInput(): CreateChatUseCaseInput {
		return this.#input;
	}

	setName(name: string): this {
		this.#input.name = name;
		return this;
	}

	setType(type: ChatTypeEnum): this {
		this.#input.type = type;
		return this;
	}

	setUserId(userId: string): this {
		this.#input.userId = userId;
		return this;
	}

	build(): CreateChatUseCaseOutput {
		const { name, type, userId } = this.#input;

		return {
			chat: new ChatEntityBuilder()
				.setName(name)
				.setType(type)
				.setOwnerId(new EntityCuid(userId))
				.build(),
		};
	}
}
