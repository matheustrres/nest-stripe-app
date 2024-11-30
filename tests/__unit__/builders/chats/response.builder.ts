import { EntityCuid } from '@/@core/domain/entity-cuid';

import { AiModelEnum } from '@/modules/chats/domain/enums/ai-model';
import {
	ResponseEntity,
	ResponseEntityProps,
} from '@/modules/chats/domain/response.entity';

import { FakerLib } from '#/__unit__/!libs/faker';

export class ResponseEntityBuilder {
	#props: ResponseEntityProps = {
		content: FakerLib.lorem.paragraph(),
		messageId: new EntityCuid(),
		model: AiModelEnum.Gemini1_0Pro,
	};

	getProps(): ResponseEntityProps {
		return this.#props;
	}

	setContent(content: string): this {
		this.#props.content = content;
		return this;
	}

	setMessageId(messageId: EntityCuid): this {
		this.#props.messageId = messageId;
		return this;
	}

	setModel(model: AiModelEnum): this {
		this.#props.model = model;
		return this;
	}

	build(): ResponseEntity {
		return ResponseEntity.createNew(this.#props);
	}
}
