import { Role } from '@/@core/enums/user-role';

export type UserEntityProps = {
	name: string;
	email: string;
	password: string;
	role: Role;
};

export class UserEntity {}
