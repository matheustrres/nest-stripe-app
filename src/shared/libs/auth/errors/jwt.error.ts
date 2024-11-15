export enum JwtErrorOriginsEnum {
	JsonWebTokenError = 'JsonWebTokenError',
	JsonWebTokenNotFoundError = 'JsonWebTokenNotFoundError',
	TokenExpiredError = 'TokenExpiredError',
}

export function getJwtErrorMessage(
	error: string | JwtErrorOriginsEnum,
): string {
	return (
		{
			JsonWebTokenError: 'Invalid authentication token signature',
			JsonWebTokenNotFoundError:
				'No authentication token found in the authentication header',
			TokenExpiredError: 'Authentication token is expired',
		}[error] || 'Invalid authentication token'
	);
}
