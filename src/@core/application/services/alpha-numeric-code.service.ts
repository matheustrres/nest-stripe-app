export abstract class AlphanumericCodeService {
	abstract genCode(defaultSize?: number): Promise<string>;
	abstract validateCode(
		context: string,
		identifier: string,
		code: string,
	): Promise<boolean>;
}
