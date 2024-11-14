import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { compare, hash } from '@node-rs/bcrypt';

import {
	CompareOptions,
	HashingService,
} from '@/@core/application/services/hashing.service';

@Injectable()
export class BcryptHashingServiceAdapter implements HashingService {
	async compare({ hashedStr, plainStr }: CompareOptions): Promise<boolean> {
		return compare(plainStr, hashedStr);
	}

	async hash(str: string) {
		const BYTES_TO_GENERATE = 16;
		const salt = randomBytes(BYTES_TO_GENERATE);
		return hash(str, null, salt);
	}
}
