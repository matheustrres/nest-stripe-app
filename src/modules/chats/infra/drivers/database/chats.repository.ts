import { Injectable } from '@nestjs/common';

import { PrismaChatMapper } from './chat.mapper';

import { ChatsRepository } from '@/modules/chats/application/repositories/chats.repository';
import { ChatEntity } from '@/modules/chats/domain/chat.entity';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaChatsRepository implements ChatsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.chat.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<ChatEntity[]> {
		const records = await this.prismaService.chat.findMany();
		if (!records.length) return [];
		return records.map(new PrismaChatMapper().toDomain);
	}

	async findByName(name: string): Promise<ChatEntity | null> {
		const record = await this.prismaService.chat.findUnique({
			where: {
				name,
			},
		});

		if (!record) return null;

		return new PrismaChatMapper().toDomain(record);
	}

	async findByOwnerId(ownerId: string): Promise<ChatEntity | null> {
		const record = await this.prismaService.chat.findFirst({
			where: {
				ownerId,
			},
		});

		if (!record) return null;

		return new PrismaChatMapper().toDomain(record);
	}

	async findOne(id: string): Promise<ChatEntity | null> {
		const record = await this.prismaService.chat.findUnique({
			where: {
				id,
			},
		});

		if (!record) return null;

		return new PrismaChatMapper().toDomain(record);
	}

	async upsert(entity: ChatEntity): Promise<void> {
		const data = new PrismaChatMapper().toPersist(entity);

		await this.prismaService.chat.upsert({
			where: {
				id: entity.id.value,
			},
			create: data,
			update: data,
		});
	}
}
