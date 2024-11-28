import { Injectable } from '@nestjs/common';

import { PrismaGuestMapper } from './guest.mapper';

import { GuestsRepository } from '@/modules/guests/application/repositories/guests.repository';
import { GuestEntity } from '@/modules/guests/domain/guest.entity';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaGuestsRepository implements GuestsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.guest.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<GuestEntity[]> {
		const records = await this.prismaService.guest.findMany();
		if (!records.length) return [];
		return records.map((record) => new PrismaGuestMapper().toDomain(record));
	}

	async findOne(id: string): Promise<GuestEntity | null> {
		const record = await this.prismaService.guest.findUnique({
			where: {
				id,
			},
		});
		if (!record) return null;
		return new PrismaGuestMapper().toDomain(record);
	}

	async upsert(entity: GuestEntity): Promise<void> {
		const data = new PrismaGuestMapper().toPersist(entity);
		await this.prismaService.guest.upsert({
			where: {
				id: entity.id.value,
			},
			create: data,
			update: data,
		});
	}
}
