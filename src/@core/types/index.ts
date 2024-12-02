import { Role } from '@/@core/enums/user-role';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type JwtPayload = {
	sub: string;
	role: Role;
};

export type WithoutUserId<T> = Omit<T, 'userId'>;

export enum OrderByEnum {
	Ascending = 'asc',
	Descending = 'desc',
}
