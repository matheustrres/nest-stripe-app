import { AIModelEnum } from './enums/ai-model';

import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';

export type ResponseEntityProps = {
	content: string;
	model: AIModelEnum;
	messageId: EntityCuid;
};

type ResponseEntityConstructorProps = CreateEntityProps<ResponseEntityProps>;
type ResponseEntityUpdatableProps = Partial<ResponseEntityProps>;

export class ResponseEntity extends Entity<ResponseEntityProps> {
	private constructor(props: ResponseEntityConstructorProps) {
		super(props);
	}

	static createNew(props: ResponseEntityProps): ResponseEntity {
		return new ResponseEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: ResponseEntityConstructorProps): ResponseEntity {
		return new ResponseEntity(props);
	}

	update(props: ResponseEntityUpdatableProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
