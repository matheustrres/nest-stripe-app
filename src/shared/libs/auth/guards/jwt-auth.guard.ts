import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { JwtPayload } from '@/@core/types';

import { IS_PROTECTED_ROUTE } from '@/shared/libs/auth/decorators/protected-route.decorator';
import {
	getJwtErrorMessage,
	JwtErrorOriginsEnum,
} from '@/shared/libs/auth/errors/jwt.error';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly tokenizationService: TokenizationService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const isProtectedRoute = this.#isProtectedRoute(ctx, this.reflector);
		if (!isProtectedRoute) return true;

		const request = ctx.switchToHttp().getRequest<Request>();

		const authToken = this.#extractAuthTokenFromBearer(request.headers);
		if (!authToken) {
			throw new UnauthorizedException(
				getJwtErrorMessage('JsonWebTokenNotFoundError'),
			);
		}

		const isValidToken = this.tokenizationService.verify(authToken);
		if (!isValidToken) {
			throw new UnauthorizedException(getJwtErrorMessage('JsonWebTokenError'));
		}

		let payload: JwtPayload;

		try {
			payload = this.tokenizationService.decode(authToken);
		} catch (error) {
			const errName = (error as Error).name;
			throw new UnauthorizedException(
				getJwtErrorMessage(errName as JwtErrorOriginsEnum),
			);
		}

		request.user = payload;

		return true;
	}

	#extractAuthTokenFromBearer(
		headers: IncomingHttpHeaders,
	): string | undefined {
		const [type, token] = headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	#isProtectedRoute(ctx: ExecutionContext, reflector: Reflector): boolean {
		return (
			reflector.getAllAndOverride<boolean, string>(IS_PROTECTED_ROUTE, [
				ctx.getHandler(),
				ctx.getClass(),
			]) || false
		);
	}
}
