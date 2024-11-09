import { Module } from '@nestjs/common';

import { PrismaModule } from '@/shared/modules/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [],
	controllers: [],
	exports: [],
})
export class UsersModule {}
