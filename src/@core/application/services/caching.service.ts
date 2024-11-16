export type CachingSetOptions = {
	key: string;
	value: string;
	ttl: number;
};

export abstract class CachingService {
	abstract set(opts: CachingSetOptions): Promise<void>;
	abstract get(key: string): Promise<string | null>;
}
