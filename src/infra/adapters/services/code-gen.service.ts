import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

import { CodeGenerationService } from '@/@core/application/services/code-gen.service';

@Injectable()
export class NanoIdCodeGenerationServiceAdapter
	implements CodeGenerationService
{
	async genAlphanumericCode(defaultSize = 5): Promise<string> {
		const nanoid = customAlphabet(
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
			defaultSize,
		);
		return nanoid();
	}
}
