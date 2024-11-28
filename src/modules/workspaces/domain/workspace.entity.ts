import { WorkspaceStatusEnum } from './enums/workspace-status';

import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Optional } from '@/@core/types';

import { UserEntity } from '@/modules/users/domain/user.entity';

export type WorkspaceEntityProps = {
	name: string;
	status: WorkspaceStatusEnum;
	tags: string[];
	ownerId: EntityCuid;
	owner: UserEntity;
	users: UserEntity[];
	deletedAt?: Date;
	archivedAt?: Date;
};

export type OptionalWorkspaceEntityProps = Optional<
	WorkspaceEntityProps,
	'tags' | 'users' | 'status' | 'archivedAt' | 'deletedAt'
>;
type WorkspaceEntityConstructorProps =
	CreateEntityProps<OptionalWorkspaceEntityProps>;
type UpdateWorkspaceEntityProps = Omit<
	Partial<OptionalWorkspaceEntityProps>,
	'status'
>;

export class WorkspaceEntity extends Entity<WorkspaceEntityProps> {
	constructor({ id, props, createdAt }: WorkspaceEntityConstructorProps) {
		super({
			id,
			props: {
				...props,
				status: props.status ?? WorkspaceStatusEnum.Active,
				tags: props.tags ?? [],
				users: props.users ?? [],
			},
			createdAt,
		});
	}

	static createNew(props: OptionalWorkspaceEntityProps): WorkspaceEntity {
		return new WorkspaceEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: WorkspaceEntityConstructorProps): WorkspaceEntity {
		return new WorkspaceEntity(props);
	}

	update(props: UpdateWorkspaceEntityProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}

	archiveWorkspace(): void {
		this.props.status = WorkspaceStatusEnum.Archived;
		this.props.archivedAt = new Date();
	}

	deleteWorkspace(): void {
		this.props.status = WorkspaceStatusEnum.Deleted;
		this.props.deletedAt = new Date();
	}
}
