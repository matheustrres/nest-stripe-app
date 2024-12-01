import { Injectable } from '@nestjs/common';

import { PrismaResponseMapper } from './response.mapper';

import { ResponsesRepository } from '@/modules/chats/application/repositories/responses.repository';
import { ResponseEntity } from '@/modules/chats/domain/response.entity';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaResponsesRepository implements ResponsesRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.response.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<ResponseEntity[]> {
		const records = await this.prismaService.response.findMany();
		if (!records.length) return [];
		return records.map(new PrismaResponseMapper().toDomain);
	}

	async findByMessageId(messageId: string): Promise<ResponseEntity | null> {
		const record = await this.prismaService.response.findFirst({
			where: {
				messageId,
			},
		});

		if (!record) return null;

		return new PrismaResponseMapper().toDomain(record);
	}

	async findOne(id: string): Promise<ResponseEntity | null> {
		const record = await this.prismaService.response.findUnique({
			where: {
				id,
			},
		});

		if (!record) return null;

		return new PrismaResponseMapper().toDomain(record);
	}

	async upsert(entity: ResponseEntity): Promise<void> {
		const data = new PrismaResponseMapper().toPersist(entity);

		await this.prismaService.response.upsert({
			where: {
				id: entity.id.value,
			},
			create: data,
			update: data,
		});
	}
}
