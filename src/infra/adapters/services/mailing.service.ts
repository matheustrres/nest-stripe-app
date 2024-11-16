import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

import {
	MailingService,
	SendMailOptions,
} from '@/@core/application/services/mailing.service';
import { EnvService } from '@/@core/config/env/env.service';

@Injectable()
export class ResendMailingServiceAdapter implements MailingService {
	readonly #logger = new Logger(ResendMailingServiceAdapter.name);
	readonly #resend: Resend;

	constructor(private readonly envService: EnvService) {
		const resendApiKey = this.envService.getKeyOrThrow('RESEND_API_KEY');
		this.#resend = new Resend(resendApiKey);
	}

	async sendMail(opts: SendMailOptions): Promise<void> {
		try {
			await this.#resend.emails.send(opts);
		} catch (error) {
			this.#logger.error('Error sending mail', console.trace(error));
			throw new BadGatewayException(error);
		}
	}
}
