import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CachingService } from '@/@core/application/services/caching.service';
import { DateService } from '@/@core/application/services/date.service';
import { MailingService } from '@/@core/application/services/mailing.service';
import { UserDomainEventsEnum } from '@/@core/enums/domain-events';

import { UserAccountCreatedDomainEvent } from '@/modules/users/domain/events/account-created.event';

import { OnDomainEvent } from '@/shared/utils/decorators/on-domain-event';

// eslint-disable-next-line import-helpers/order-imports
import { ValidationCodeMailTemplate } from '$/templates/validation-code-mail';

@Injectable()
export class UserAccountCreatedDomainEventListener {
	readonly #logger = new Logger(UserAccountCreatedDomainEventListener.name);

	constructor(
		private readonly cachingService: CachingService,
		private readonly dateService: DateService,
		private readonly mailingService: MailingService,
	) {}

	@OnDomainEvent(UserDomainEventsEnum.AccountCreated)
	async handle(event: UserAccountCreatedDomainEvent) {
		try {
			const { code, email, name } = event.data;

			const TEN_MINS_IN_SECS = 600;
			const codeExpirationDate = this.dateService.addSeconds({
				amount: TEN_MINS_IN_SECS,
				date: this.dateService.now(),
			});
			const codeExpirationDateUnixTimestamp =
				this.dateService.toUnixTimestamp(codeExpirationDate);

			await this.cachingService.set({
				key: `sign_up:${email}`,
				value: code,
				ttl: codeExpirationDateUnixTimestamp,
			});

			await this.mailingService.sendMail({
				to: email,
				from: 'StripeApp <onboarding@resend.dev>',
				subject: 'Account confirmation',
				text: 'Account confirmation',
				html: ValidationCodeMailTemplate({
					name,
					code,
					expiresInMessage: 'This code is valid for 10 minutes',
				}),
			});
		} catch (error) {
			this.#logger.error(
				'Error sending user account confirmation email: ',
				console.trace(error),
			);
			throw new BadRequestException(error);
		}
	}
}
