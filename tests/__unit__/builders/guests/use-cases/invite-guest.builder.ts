import { EntityCuid } from '@/@core/domain/entity-cuid';

import {
	InviteGuestUseCaseInput,
	InviteGuestUseCaseOutput,
} from '@/modules/guests/application/use-cases/invite-guest.use-case';

import { FakerLib } from '#/__unit__/!libs/faker';
import { InviteEntityBuilder } from '#/__unit__/builders/guests/invite.builder';

export class InviteGuestUseCaseBuilder {
	#input: InviteGuestUseCaseInput = {
		guestEmail: FakerLib.internet.email(),
		guestName: FakerLib.person.fullName(),
		ownerId: new EntityCuid().value,
	};

	getInput(): InviteGuestUseCaseInput {
		return this.#input;
	}

	setGuestEmail(guestEmail: string): this {
		this.#input.guestEmail = guestEmail;
		return this;
	}

	setGuestName(guestName: string): this {
		this.#input.guestName = guestName;
		return this;
	}

	setOwnerId(ownerId: EntityCuid): this {
		this.#input.ownerId = ownerId.value;
		return this;
	}

	build(): InviteGuestUseCaseOutput {
		const { ownerId } = this.#input;

		return {
			invite: new InviteEntityBuilder()
				.setOwnerId(new EntityCuid(ownerId))
				.build(),
		};
	}
}
