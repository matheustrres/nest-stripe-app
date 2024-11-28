import { UserEntity } from '@/modules/users/domain/user.entity';
import { WorkspaceStatusEnum } from '@/modules/workspaces/domain/enums/workspace-status';
import {
	OptionalWorkspaceEntityProps,
	WorkspaceEntity,
} from '@/modules/workspaces/domain/workspace.entity';

import { FakerLib } from '#/__unit__/!libs/faker';
import { UserEntityBuilder } from '#/__unit__/builders/users/user.builder';

export class WorkspaceEntityBuilder {
	#owner = new UserEntityBuilder().build();

	#props: OptionalWorkspaceEntityProps = {
		name: FakerLib.company.name(),
		owner: this.#owner,
		ownerId: this.#owner.id,
	};

	getProps(): OptionalWorkspaceEntityProps {
		return this.#props;
	}

	setName(name: string): this {
		this.#props.name = name;
		return this;
	}

	setOwner(owner: UserEntity): this {
		this.#props.owner = owner;
		this.#props.ownerId = owner.id;
		return this;
	}

	setStatus(status: WorkspaceStatusEnum): this {
		if (status == WorkspaceStatusEnum.Deleted) {
			this.#props.status = status;
			this.#setDeletedAt(new Date());
		}
		if (status == WorkspaceStatusEnum.Archived) {
			this.#props.status = status;
			this.#setArchivedAt(new Date());
		}
		return this;
	}

	addTag(tag: string): this {
		this.#props.tags?.push(tag);
		return this;
	}

	addUser(user: UserEntity): this {
		this.#props.users?.push(user);
		return this;
	}

	#setDeletedAt(date: Date): this {
		this.#props.deletedAt = date;
		return this;
	}

	#setArchivedAt(date: Date): this {
		this.#props.archivedAt = date;
		return this;
	}

	build(): WorkspaceEntity {
		return WorkspaceEntity.createNew(this.#props);
	}
}
