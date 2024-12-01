import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	CreateMessageUseCaseInput,
	CreateMessageUseCaseOutput,
} from '@/modules/chats/application/use-cases/create-message.use-case';

import { FakerLib } from '#/__unit__/!libs/faker';
import { MessageEntityBuilder } from '#/__unit__/builders/chats/message.builder';

export class CreateMessageUseCaseBuilder {
	#input: CreateMessageUseCaseInput = {
		chatId: new EntityCuid().value,
		content: FakerLib.lorem.paragraph(),
		userId: new EntityCuid().value,
	};

	getInput(): CreateMessageUseCaseInput {
		return this.#input;
	}

	setChatId(chatId: EntityCuid): this {
		this.#input.chatId = chatId.value;
		return this;
	}

	setContent(content: string): this {
		this.#input.content = content;
		return this;
	}

	setUserId(userId: EntityCuid): this {
		this.#input.userId = userId.value;
		return this;
	}

	build(): CreateMessageUseCaseOutput {
		const { chatId, content } = this.#input;

		return {
			message: new MessageEntityBuilder()
				.setChatId(new EntityCuid(chatId))
				.setContent(content)
				.build(),
		};
	}
}
