import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { WithoutUserId } from '@/@core/types';

import { CreateSubscriptionUseCaseInput } from '@/modules/subscriptions/application/use-cases/create-subscription.use-case';

export class CreateSubscriptionBodyDto
	implements WithoutUserId<CreateSubscriptionUseCaseInput>
{
	@ApiProperty({
		type: 'string',
		required: true,
		example: 'pm_',
	})
	@IsNotEmpty()
	paymentMethodId!: string;

	@ApiProperty({
		type: 'string',
		required: true,
		example: 'prod_RBirDCtO3k153f',
	})
	@IsNotEmpty()
	productId!: string;
}
