import { WorkspaceStatusEnum } from '@/modules/workspaces/domain/enums/workspace-status';
import { WorkspaceEntity } from '@/modules/workspaces/domain/workspace.entity';

import { WorkspaceEntityBuilder } from '#/__unit__/builders/workspaces/workspace.builder';

describe(WorkspaceEntity.name, () => {
	it('should create a new workspace', () => {
		const workspace = new WorkspaceEntityBuilder()
			.setStatus(WorkspaceStatusEnum.Deleted)
			.setName('MySpace')
			.build();

		const { name, status } = workspace.getProps();

		expect(workspace).toBeDefined();
		expect(name).toBe('MySpace');
		expect(status).toBe(WorkspaceStatusEnum.Deleted);
	});

	it('should restore a workspace', () => {
		const workspace = new WorkspaceEntityBuilder().build();
		const restoredWorkspace = WorkspaceEntity.restore({
			id: workspace.id,
			props: workspace.getProps(),
			createdAt: workspace.createdAt,
		});

		expect(restoredWorkspace).toStrictEqual(workspace);
	});
});
