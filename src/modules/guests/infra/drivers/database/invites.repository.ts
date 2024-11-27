import { Injectable } from '@nestjs/common';

import { PrismaInviteMapper } from './invite.mapper';

import { InvitesRepository } from '@/modules/guests/application/repositories/invites.repository';
import { InviteEntity } from '@/modules/guests/domain/invite.entity';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaInvitesRepository implements InvitesRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.invite.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<InviteEntity[]> {
		const records = await this.prismaService.invite.findMany();
		if (!records.length) return [];
		return records.map(new PrismaInviteMapper().toDomain);
	}

	async findOne(id: string): Promise<InviteEntity | null> {
		const record = await this.prismaService.invite.findUnique({
			where: {
				id,
			},
		});
		if (!record) return null;
		return new PrismaInviteMapper().toDomain(record);
	}

	async upsert(entity: InviteEntity): Promise<void> {
		const data = new PrismaInviteMapper().toPersist(entity);
		await this.prismaService.invite.upsert({
			where: {
				id: entity.id.value,
			},
			create: data,
			update: data,
		});
	}
}
