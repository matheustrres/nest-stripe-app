import { Injectable } from '@nestjs/common';

import { MailingService } from '@/@core/application/services/mailing.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { GuestDomainEventsEnum } from '@/@core/enums/domain-events';
import { RoleEnum } from '@/@core/enums/user-role';
import { GuestSignUpTokenSubType } from '@/@core/types';

import { GuestInvitedDomainEvent } from '@/modules/guests/domain/events/guest-invited.event';

import { OnDomainEvent } from '@/shared/utils/decorators/on-domain-event';

// eslint-disable-next-line import-helpers/order-imports
import { InviteGuestEmailTemplate } from '$/templates/invite-guest-email';

@Injectable()
export class GuestInvitedDomainEventListener {
	constructor(
		private readonly mailingService: MailingService,
		private readonly tokenizationService: TokenizationService,
	) {}

	@OnDomainEvent(GuestDomainEventsEnum.Invited)
	async handle(event: GuestInvitedDomainEvent): Promise<void> {
		console.log(event);
		const {
			email,
			inviteExpirationTimeInSeconds,
			inviteId,
			name,
			ownerId,
			ownerName,
		} = event.data;

		const token = await this.tokenizationService.sign(
			{
				role: RoleEnum.Guest,
				sub: this.#bufferizeTokenSubData(`${ownerId}:${inviteId}:${email}`),
			},
			`${inviteExpirationTimeInSeconds}s`,
		);

		const linkWithToken = `http://localhost:4001/guests/sign-up?token=${token}`;

		await this.mailingService.sendMail({
			to: email,
			from: 'CollabHub <onboarding@resend.dev>',
			subject: 'Invitation to create a CollabHub account!',
			text: `${ownerName} has invited you to create a CollabHub account. Click on the link below to sign up:`,
			html: InviteGuestEmailTemplate({
				guestEmail: email,
				guestName: name,
				linkWithToken,
				ownerName,
			}),
		});
	}

	#bufferizeTokenSubData(sub: GuestSignUpTokenSubType): string {
		return Buffer.from(sub).toString('base64');
	}
}
