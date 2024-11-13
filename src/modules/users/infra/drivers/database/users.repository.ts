import { Injectable } from '@nestjs/common';

import { PrismaUserMapper } from './user.mapper';

import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UserEntity } from '@/modules/users/domain/user.entity';

import { PrismaService } from '@/shared/modules/prisma/prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async delete(id: string): Promise<void> {
		await this.prismaService.user.delete({
			where: {
				id,
			},
		});
	}

	async find(): Promise<UserEntity[]> {
		const records = await this.prismaService.user.findMany();
		if (!records.length) return [];
		return records.map((record) => new PrismaUserMapper().toDomain(record));
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const record = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});
		if (!record) return null;
		return new PrismaUserMapper().toDomain(record);
	}

	async findOne(id: string): Promise<UserEntity | null> {
		const record = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		});
		if (!record) return null;
		return new PrismaUserMapper().toDomain(record);
	}

	async insert(entity: UserEntity): Promise<void> {
		const data = new PrismaUserMapper().toPersist(entity);
		await this.prismaService.user.create({
			data,
		});
	}

	async update(entity: UserEntity): Promise<void> {
		const data = new PrismaUserMapper().toPersist(entity);
		await this.prismaService.user.update({
			where: {
				id: entity.id.value,
			},
			data,
		});
	}
}
