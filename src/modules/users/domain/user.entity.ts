import { CreateEntityProps, Entity } from '@/@core/domain/entity';
import { EntityCuid } from '@/@core/domain/entity-cuid';
import { Role } from '@/@core/enums/user-role';
import { Optional } from '@/@core/types';

export type UserEntityProps = {
	name: string;
	email: string;
	password: string;
	role: Role;
};

type OptionaUserEntityConstructorProps = Optional<UserEntityProps, 'role'>;
type UserEntityConstructorProps =
	CreateEntityProps<OptionaUserEntityConstructorProps>;
type UpdateUserEntityProps = Partial<UserEntityProps>;

export class UserEntity extends Entity<UserEntityProps> {
	private constructor({ id, props, createdAt }: UserEntityConstructorProps) {
		super({
			id,
			props: {
				...props,
				role: props.role ?? Role.User,
			},
			createdAt,
		});
	}

	static createNew(props: OptionaUserEntityConstructorProps): UserEntity {
		return new UserEntity({
			id: new EntityCuid(),
			props,
			createdAt: new Date(),
		});
	}

	static restore(props: UserEntityConstructorProps): UserEntity {
		return new UserEntity(props);
	}

	update(props: UpdateUserEntityProps): void {
		this.props = {
			...this.props,
			...props,
		};
	}
}
