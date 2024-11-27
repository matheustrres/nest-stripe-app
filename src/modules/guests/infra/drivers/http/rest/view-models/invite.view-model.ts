import { InviteEntity } from '@/modules/guests/domain/invite.entity';

export type InviteHttpResponse = {
	id: string;
	ownerId: string;
	guestId?: string;
	status: string;
	expiresAt: string;
	createdAt: Date;
};

export class InviteViewModel {
	static toHttp(invite: InviteEntity): InviteHttpResponse {
		const { expiresAt, ownerId, status, guestId } = invite.getProps();

		return {
			id: invite.id.value,
			ownerId: ownerId.value,
			status: status.toString(),
			...(guestId && {
				guestId: guestId.value,
			}),
			expiresAt: expiresAt.toISOString(),
			createdAt: invite.createdAt,
		};
	}
}
