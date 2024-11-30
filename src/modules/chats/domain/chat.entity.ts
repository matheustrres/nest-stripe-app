import { ChatTypeEnum } from './enums/chat-type';
import { MessageEntity } from './message.entity';

import {
	CreateDeletableEntityProps,
	DeletableEntity,
} from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Optional } from '@/@core/types';

export type ChatEntityProps = {
	name: string;
	type: ChatTypeEnum;
	ownerId: EntityCuid;
	messages: MessageEntity[];
	archivedAt?: Date;
};

export type ChatEntityOptionalProps = Optional<ChatEntityProps, 'messages'>;
type ChatEntityConstructorProps =
	CreateDeletableEntityProps<ChatEntityOptionalProps>;
type ChatEntityUpdateProps = Partial<ChatEntityProps>;

export class ChatEntity extends DeletableEntity<ChatEntityProps> {
	private constructor({
		id,
		props,
		createdAt,
		deletedAt,
	}: ChatEntityConstructorProps) {
		super({
			id,
			props: {
				...props,
				messages: props.messages ?? [],
			},
			createdAt,
			deletedAt,
		});
	}

	static createNew(props: ChatEntityOptionalProps): ChatEntity {
		return new ChatEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: ChatEntityConstructorProps): ChatEntity {
		return new ChatEntity(props);
	}

	update(props: ChatEntityUpdateProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
