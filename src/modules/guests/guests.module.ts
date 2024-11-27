import { Module } from '@nestjs/common';

import { InvitesRepository } from './application/repositories/invites.repository';
import { InviteGuestUseCase } from './application/use-cases/invite-guest.use-case';
import { PrismaInvitesRepository } from './infra/drivers/database/invites.repository';
import { GuestsController } from './infra/drivers/http/rest/guests.controller';

import { AdaptersModule } from '@/infra/adapters/adapters.module';

import { UsersModule } from '@/modules/users/users.module';

@Module({
	imports: [AdaptersModule, UsersModule],
	providers: [
		{
			provide: InvitesRepository,
			useClass: PrismaInvitesRepository,
		},
		InviteGuestUseCase,
	],
	controllers: [GuestsController],
})
export class GuestsModule {}
