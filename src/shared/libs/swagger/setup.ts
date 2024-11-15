import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { OPEN_API_AUTH_NAME } from './openapi';

import { ApiPathsEnum } from '@/@core/enums/api-paths';

export function setupSwagger(app: INestApplication): void {
	const docBuilder = new DocumentBuilder()
		.setTitle('Nest Stripe App')
		.setVersion('1.0.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			OPEN_API_AUTH_NAME,
		);

	for (const apiPath of Object.values(ApiPathsEnum)) {
		docBuilder.addTag(apiPath);
	}

	const swaggerDoc = SwaggerModule.createDocument(app, docBuilder.build());

	SwaggerModule.setup('api', app, swaggerDoc);
}
