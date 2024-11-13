import { Entity } from './entity';

export interface Mapper<DomainEntity extends Entity<unknown>, DbModel> {
	toDomain(model: DbModel, ...args: any[]): DomainEntity;
	toPersist(entity: DomainEntity, ...args: any[]): DbModel;
}
