import { EntityCuid } from './entity-cuid';

export type CreateEntityProps<Props> = {
	id: EntityCuid;
	props: Props;
	createdAt: Date;
};

export abstract class Entity<Props> {
	readonly id: EntityCuid;
	protected props: Props;
	readonly createdAt: Date;

	constructor({ id, props, createdAt }: CreateEntityProps<Props>) {
		this.id = id;
		this.props = props;
		this.createdAt = createdAt;
	}

	getProps(): Props {
		return this.props;
	}

	static isEntity(data: unknown): data is Entity<unknown> {
		return data instanceof Entity;
	}
}
