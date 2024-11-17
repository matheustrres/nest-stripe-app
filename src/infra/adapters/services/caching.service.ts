import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import {
	CachingService,
	CachingSetOptions,
} from '@/@core/application/services/caching.service';

@Injectable()
export class NestCachingServiceAdapter implements CachingService {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	async get(key: string): Promise<string | null> {
		const data = await this.cacheManager.get<string>(key);
		return data ?? null;
	}

	async set({ key, ttl, value }: CachingSetOptions): Promise<void> {
		return this.cacheManager.set(key, value, ttl);
	}
}
