import { Injectable } from '@nestjs/common';

import { PrismaMessageMapper } from './message.mapper';

import { MessagesRepository } from '@/modules/chats/application/repositories/messages.repository';
import { MessageEntity } from '@/modules/chats/domain/message.entity';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaMessagesRepository implements MessagesRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.message.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<MessageEntity[]> {
		const records = await this.prismaService.message.findMany();
		if (!records.length) return [];
		return records.map(new PrismaMessageMapper().toDomain);
	}

	async findOne(id: string): Promise<MessageEntity | null> {
		const record = await this.prismaService.message.findUnique({
			where: {
				id,
			},
		});

		if (!record) return null;

		return new PrismaMessageMapper().toDomain(record);
	}

	async upsert(entity: MessageEntity): Promise<void> {
		const data = new PrismaMessageMapper().toPersist(entity);

		await this.prismaService.message.upsert({
			where: {
				id: entity.id.value,
			},
			create: data,
			update: data,
		});
	}
}
