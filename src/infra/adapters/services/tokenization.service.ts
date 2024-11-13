import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { EnvService } from '@/@core/config/env/env.service';
import { JwtPayload } from '@/@core/types';

@Injectable()
export class JwtTokenizationServiceAdapter implements TokenizationService {
	constructor(private readonly envService: EnvService) {}

	decode(token: string): JwtPayload {
		const payload = jwt.decode(token);

		if (!payload || typeof payload === 'string')
			throw new InvalidCredentialsError();

		return payload as JwtPayload;
	}

	async sign(payload: JwtPayload, expiresIn: string) {
		return jwt.sign(payload, this.envService.getKeyOrThrow('JWT_KEY'), {
			expiresIn,
		});
	}

	verify(token: string): boolean {
		try {
			const key = this.envService.getKeyOrThrow('JWT_KEY');
			jwt.verify(token, key, { ignoreExpiration: false });
			return true;
		} catch {
			return false;
		}
	}
}
