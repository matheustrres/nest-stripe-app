import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

import { AlphanumericCodeService } from '@/@core/application/services/alpha-numeric-code.service';
import { CachingService } from '@/@core/application/services/caching.service';

@Injectable()
export class NanoIdAlphanumericCodeServiceAdapter
	implements AlphanumericCodeService
{
	constructor(private readonly cachingService: CachingService) {}

	async genCode(defaultSize = 5): Promise<string> {
		const nanoid = customAlphabet(
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			defaultSize,
		);
		return nanoid();
	}

	async validateCode(
		context: string,
		identifier: string,
		code: string,
	): Promise<boolean> {
		const key = `${context}:${identifier}`;
		const codeInCache = await this.cachingService.get(key);
		return code === codeInCache;
	}
}
