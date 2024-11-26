import { InviteStatusEnum } from '@/modules/guests/domain/enums/invite-status';
import { InviteEntity } from '@/modules/guests/domain/invite.entity';

import { InviteEntityBuilder } from '#/__unit__/builders/guests/invite.builder';

describe(InviteEntity.name, () => {
	it('should create a new invite', () => {
		const invite = new InviteEntityBuilder()
			.setStatus(InviteStatusEnum.Rejected)
			.build();

		expect(invite).toBeDefined();
		expect(invite.getProps().status).toBe(InviteStatusEnum.Pending);
	});

	it('should restore a invite', () => {
		const invite = new InviteEntityBuilder().build();
		const restoredInvite = InviteEntity.restore({
			id: invite.id,
			props: invite.getProps(),
			createdAt: invite.createdAt,
		});

		expect(restoredInvite).toBeDefined();
		expect(restoredInvite).toStrictEqual(invite);
	});
});
