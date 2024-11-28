import { Module } from '@nestjs/common';

import { GuestsRepository } from './application/repositories/guests.repository';
import { InvitesRepository } from './application/repositories/invites.repository';
import { InviteGuestUseCase } from './application/use-cases/invite-guest.use-case';
import { GuestSignUpUseCase } from './application/use-cases/sign-up.use-case';
import { PrismaGuestsRepository } from './infra/drivers/database/guests.repository';
import { PrismaInvitesRepository } from './infra/drivers/database/invites.repository';
import { GuestsController } from './infra/drivers/http/rest/guests.controller';
import { GuestInvitedDomainEventListener } from './infra/events/listeners/guest-invited.listener';

import { AdaptersModule } from '@/infra/adapters/adapters.module';

import { UsersModule } from '@/modules/users/users.module';

import { PrismaModule } from '@/shared/modules/prisma/prisma.module';

@Module({
	imports: [PrismaModule, AdaptersModule, UsersModule],
	providers: [
		{
			provide: GuestsRepository,
			useClass: PrismaGuestsRepository,
		},
		{
			provide: InvitesRepository,
			useClass: PrismaInvitesRepository,
		},
		InviteGuestUseCase,
		GuestSignUpUseCase,
		GuestInvitedDomainEventListener,
	],
	controllers: [GuestsController],
})
export class GuestsModule {}
