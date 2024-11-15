import { Controller, applyDecorators } from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiBody,
	ApiHeader,
	ApiParam,
	ApiQuery,
	ApiResponseOptions,
	ApiOperationOptions,
	ApiBodyOptions,
	ApiHeaderOptions,
	ApiParamOptions,
	ApiQueryOptions,
	ApiTags,
	ApiBearerAuth,
} from '@nestjs/swagger';

import { ApiPathsEnum } from '@/@core/enums/api-paths';

type SwaggerOptions = {
	authName?: string;
	operation: ApiOperationOptions;
	responses: ApiResponseOptions[];
	body?: ApiBodyOptions;
	headers?: ApiHeaderOptions[];
	params?: ApiParamOptions[];
	queries?: ApiQueryOptions[];
};

export const OPEN_API_AUTH_NAME = 'access-token';

export function OpenApiRoute({
	authName,
	operation,
	responses,
	body,
	headers,
	params,
	queries,
}: SwaggerOptions) {
	return applyDecorators(
		...([
			ApiOperation(operation),
			...Object.entries(responses).map(([, response]) =>
				ApiResponse({ ...response }),
			),
			authName && ApiBearerAuth(authName),
			body && ApiBody(body),
			...(queries || []).map(ApiQuery),
			...(headers || []).map(ApiHeader),
			...(params || []).map(ApiParam),
		].filter(Boolean) as MethodDecorator[]),
	);
}

export function OpenApiController(prefix: ApiPathsEnum) {
	return applyDecorators(Controller(prefix), ApiTags(prefix));
}
