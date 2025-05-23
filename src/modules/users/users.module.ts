import { Module } from '@nestjs/common';

import { UsersRepository } from './application/repositories/users.repository';
import { ConfirmUserAccountUseCase } from './application/use-cases/confirm-account.use-case';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import { SignUpUseCase } from './application/use-cases/sign-up.use-case';
import { PrismaUsersRepository } from './infra/drivers/database/users.repository';
import { UsersController } from './infra/drivers/http/rest/users.controller';
import { UserAccountCreatedDomainEventListener } from './infra/events/listeners/account-created.listener';

import { AdaptersModule } from '@/infra/adapters/adapters.module';

import { PrismaModule } from '@/shared/modules/prisma/prisma.module';

@Module({
	imports: [PrismaModule, AdaptersModule],
	providers: [
		{
			provide: UsersRepository,
			useClass: PrismaUsersRepository,
		},
		ConfirmUserAccountUseCase,
		SignInUseCase,
		SignUpUseCase,
		UserAccountCreatedDomainEventListener,
	],
	controllers: [UsersController],
	exports: [UsersRepository],
})
export class UsersModule {}
