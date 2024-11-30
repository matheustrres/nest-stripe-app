import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	ChatEntity,
	ChatEntityOptionalProps,
} from '@/modules/chats/domain/chat.entity';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

import { FakerLib } from '#/__unit__/!libs/faker';

export class ChatEntityBuilder {
	#props: ChatEntityOptionalProps = {
		name: FakerLib.company.name(),
		ownerId: new EntityCuid(),
		type: ChatTypeEnum.QuickSearch,
	};

	getProps(): ChatEntityOptionalProps {
		return this.#props;
	}

	setName(name: string): this {
		this.#props.name = name;
		return this;
	}

	setOwnerId(ownerId: EntityCuid): this {
		this.#props.ownerId = ownerId;
		return this;
	}

	setType(type: ChatTypeEnum): this {
		this.#props.type = type;
		return this;
	}

	setArchivedAt(archivedAt: Date): this {
		this.#props.archivedAt = archivedAt;
		return this;
	}

	build(): ChatEntity {
		return ChatEntity.createNew(this.#props);
	}
}
