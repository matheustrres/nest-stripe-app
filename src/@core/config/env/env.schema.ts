import { IsEnum, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

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
	JWT_KEY?: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^pk_test_.*$/)
	STRIPE_PUBLIC_KEY?: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^sk_test_.*$/)
	STRIPE_TEST_KEY?: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^re_.*$/)
	RESEND_API_KEY?: string;
}
