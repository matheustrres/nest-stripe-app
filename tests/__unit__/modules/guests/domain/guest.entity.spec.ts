import { GuestEntity } from '@/modules/guests/domain/guest.entity';

import { GuestEntityBuilder } from '#/__unit__/builders/guests/guest.builder';

describe(GuestEntity.name, () => {
	it('should create a new guest', () => {
		const guest = new GuestEntityBuilder().build();
		expect(guest).toBeDefined();
	});

	it('should restore a guest', () => {
		const guest = new GuestEntityBuilder().build();
		const restoredGuest = GuestEntity.restore({
			id: guest.id,
			props: guest.getProps(),
			createdAt: guest.createdAt,
		});

		expect(restoredGuest).toBeDefined();
		expect(restoredGuest).toStrictEqual(guest);
	});
});
