import { ResponseEntity } from './response.entity';

import {
	CreateDeletableEntityProps,
	DeletableEntity,
} from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Optional } from '@/@core/types';

export type MessageEntityProps = {
	chatId: EntityCuid;
	content: string;
	responses: ResponseEntity[];
};

export type MessageEntityOptionalProps = Optional<
	MessageEntityProps,
	'responses'
>;
type MessageEntityConstructorProps =
	CreateDeletableEntityProps<MessageEntityOptionalProps>;
type MessageEntityUpdateProps = Partial<MessageEntityProps>;

export class MessageEntity extends DeletableEntity<MessageEntityProps> {
	private constructor({
		id,
		createdAt,
		props,
		deletedAt,
	}: MessageEntityConstructorProps) {
		super({
			id,
			props: {
				...props,
				responses: props.responses ?? [],
			},
			createdAt,
			deletedAt,
		});
	}

	static createNew(props: MessageEntityOptionalProps): MessageEntity {
		return new MessageEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: MessageEntityConstructorProps): MessageEntity {
		return new MessageEntity(props);
	}

	update(props: MessageEntityUpdateProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
