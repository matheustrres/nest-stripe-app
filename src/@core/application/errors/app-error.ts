import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

export type AppErrorProps = {
	code: HttpStatusCodeEnum;
	message: string;
};

export abstract class AppError extends Error {
	readonly message: string;
	readonly code: number;

	constructor(error: AppErrorProps) {
		super(error.message);
		this.message = error.message;
		this.code = error.code;
	}
}
