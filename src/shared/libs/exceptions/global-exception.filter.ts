import {
	HttpException,
	HttpStatus,
	Catch,
	type ArgumentsHost,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';

import { BaseExceptionFilter } from './base-exception-filter';

import { AppError } from '@/@core/application/errors/app-error';

type HttpExceptionResponse = {
	message: string | string[];
	error: string;
	statusCode: number;
};

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter<unknown> {
	constructor() {
		super();
	}

	catch(exception: unknown, host: ArgumentsHost) {
		const { response, endpoint } = this.getHttpContext(host);

		if (exception instanceof HttpException) {
			const { message, statusCode } =
				exception.getResponse() as HttpExceptionResponse;
			return this.sendErrorResponse(response, {
				code: statusCode,
				content: message,
				endpoint,
				status: 'ERROR',
			});
		}

		if (exception instanceof AppError) {
			return this.sendErrorResponse(response, {
				code: exception.code,
				content: exception.message,
				endpoint,
				status: 'ERROR',
			});
		}

		if (exception instanceof JsonWebTokenError) {
			return this.sendErrorResponse(response, {
				code: HttpStatus.UNAUTHORIZED,
				content: exception.message,
				endpoint,
				status: 'ERROR',
			});
		}

		this.logger.error(
			'Unhandled exception has been caught: ',
			console.trace(exception),
		);

		return this.sendErrorResponse(response, {
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			content: [],
			endpoint,
			status: 'Internal Server Error',
		});
	}
}
