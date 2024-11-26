import { Module } from '@nestjs/common';

import { InvitesRepository } from './application/repositories/invites.repository';
import { InviteGuestUseCase } from './application/use-cases/invite-guest.use-case';
import { PrismaInvitesRepository } from './infra/drivers/database/invites.repository';

import { AdaptersModule } from '@/infra/adapters/adapters.module';

@Module({
	imports: [AdaptersModule],
	providers: [
		{
			provide: InvitesRepository,
			useClass: PrismaInvitesRepository,
		},
		InviteGuestUseCase,
	],
})
export class GuestsModule {}
