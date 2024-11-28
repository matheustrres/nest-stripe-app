import { RoleEnum } from '@/@core/enums/user-role';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type JwtPayload = {
	sub: string;
	role: RoleEnum;
};

export type WithoutUserId<T> = Omit<T, 'userId'>;

type OwnerId = string;
type InviteId = string;
type GuestEmail = string;

export type GuestSignUpTokenSubType = `${OwnerId}:${InviteId}:${GuestEmail}`;
