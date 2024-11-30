import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	MessageEntity,
	MessageEntityOptionalProps,
} from '@/modules/chats/domain/message.entity';

import { FakerLib } from '#/__unit__/!libs/faker';

export class MessageEntityBuilder {
	#props: MessageEntityOptionalProps = {
		chatId: new EntityCuid(),
		content: FakerLib.lorem.paragraph(),
	};

	getProps(): MessageEntityOptionalProps {
		return this.#props;
	}

	setChatId(chatId: EntityCuid): this {
		this.#props.chatId = chatId;
		return this;
	}

	setContent(content: string): this {
		this.#props.content = content;
		return this;
	}

	build(): MessageEntity {
		return MessageEntity.createNew(this.#props);
	}
}
