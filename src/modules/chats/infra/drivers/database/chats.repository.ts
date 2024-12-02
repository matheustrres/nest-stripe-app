import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaChatMapper } from './chat.mapper';
import { PrismaMessageMapper } from './message.mapper';

import {
	ChatsRepository,
	ListOptions,
} from '@/modules/chats/application/repositories/chats.repository';
import { ChatEntity } from '@/modules/chats/domain/chat.entity';
import { MessageEntity } from '@/modules/chats/domain/message.entity';

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

	async findByOwnerId(
		chatId: string,
		ownerId: string,
	): Promise<ChatEntity | null> {
		const record = await this.prismaService.chat.findFirst({
			where: {
				id: chatId,
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

	async listChatMessages(
		chatId: string,
		options?: ListOptions,
	): Promise<MessageEntity[]> {
		const orderBy: Record<string, Prisma.SortOrder> = {
			createdAt: options?.orderBy || 'asc',
		};

		const records = await this.prismaService.chat.findMany({
			where: {
				id: chatId,
			},
			orderBy,
			include: {
				messages: {
					orderBy,
					include: {
						responses: {
							orderBy,
						},
					},
				},
			},
		});

		if (!records.length) return [];

		return records.flatMap((record) =>
			record.messages.map((msg) =>
				new PrismaMessageMapper().toDomain(msg, {
					relations: {
						responses: msg.responses,
					},
				}),
			),
		);
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
