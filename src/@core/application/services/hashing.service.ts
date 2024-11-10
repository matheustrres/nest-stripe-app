export type CompareOptions = {
	plainStr: string;
	hashedStr: string;
};

export abstract class HashingService {
	abstract hash(str: string): Promise<string>;
	abstract compare(opts: CompareOptions): Promise<boolean>;
}
