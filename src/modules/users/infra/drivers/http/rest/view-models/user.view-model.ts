import { UserEntity } from '@/modules/users/domain/user.entity';

export type UserHttpResponse = {
	id: string;
	name: string;
	email: string;
	role: string;
	tokens: number;
	createdAt: Date;
};

export class UserViewModel {
	static toHttp(user: UserEntity): UserHttpResponse {
		const { name, email, role, tokens } = user.getProps();

		return {
			id: user.id.value,
			name,
			email,
			role,
			tokens: tokens.amount,
			createdAt: user.createdAt,
		};
	}
}
