import { Entity } from '../domain/entity';

export abstract class Repository<DomainEntity extends Entity<unknown>> {
	abstract delete(id: string): Promise<void>;
	abstract find(): Promise<DomainEntity[]>;
	abstract findOne(id: string): Promise<DomainEntity | null>;
	abstract insert(entity: DomainEntity): Promise<void>;
	abstract update(entity: DomainEntity): Promise<void>;
}
