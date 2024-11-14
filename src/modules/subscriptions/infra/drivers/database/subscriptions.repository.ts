import { Injectable } from '@nestjs/common';

import { SubscriptionsRepository } from '@/modules/subscriptions/application/repositories/subscriptions.repository';
import { SubscriptionEntity } from '@/modules/subscriptions/domain/subscription.entity';
import { PrismaSubscriptionMapper } from '@/modules/subscriptions/infra/drivers/database/subscription.mapper';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.subscription.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<SubscriptionEntity[]> {
		const records = await this.prismaService.subscription.findMany();
		if (!records.length) return [];
		return records.map(new PrismaSubscriptionMapper().toDomain);
	}

	async findByUserId(userId: string): Promise<SubscriptionEntity | null> {
		const record = await this.prismaService.subscription.findUnique({
			where: {
				userId,
			},
		});
		if (!record) return null;
		return new PrismaSubscriptionMapper().toDomain(record);
	}

	async findOne(id: string): Promise<SubscriptionEntity | null> {
		const record = await this.prismaService.subscription.findUnique({
			where: {
				id,
			},
		});
		if (!record) return null;
		return new PrismaSubscriptionMapper().toDomain(record);
	}

	async insert(entity: SubscriptionEntity): Promise<void> {
		const data = new PrismaSubscriptionMapper().toPersist(entity);
		await this.prismaService.subscription.create({
			data,
		});
	}

	async update(entity: SubscriptionEntity): Promise<void> {
		const data = new PrismaSubscriptionMapper().toPersist(entity);
		await this.prismaService.subscription.update({
			where: {
				id: entity.id.value,
			},
			data,
		});
	}
}
