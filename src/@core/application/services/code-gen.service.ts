export abstract class CodeGenerationService {
	abstract genAlphanumericCode(defaultSize?: number): Promise<string>;
}
