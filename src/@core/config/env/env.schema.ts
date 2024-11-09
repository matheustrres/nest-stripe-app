import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

import { NodeEnvEnum } from '@/@core/enums/node-env';

export class EnvSchema {
	@IsEnum(NodeEnvEnum)
	@IsNotEmpty()
	NODE_ENV?: NodeEnvEnum;

	@IsString()
	@IsNotEmpty()
	TZ?: string;

	@IsInt()
	@IsNotEmpty()
	PORT?: number;

	@IsString()
	@IsNotEmpty()
	PG_USER?: string;

	@IsString()
	@IsNotEmpty()
	PG_PASSWORD?: string;

	@IsString()
	@IsNotEmpty()
	PG_DATABASE?: string;

	@IsInt()
	@IsNotEmpty()
	PG_PORT?: number;

	@IsString()
	@IsNotEmpty()
	PG_HOST?: string;

	@IsString()
	@IsNotEmpty()
	DATABASE_URL?: string;

	@IsString()
	@IsNotEmpty()
	STRIPE_PUBLIC_KEY?: string;

	@IsString()
	@IsNotEmpty()
	STRIPE_TEST_KEY?: string;
}
