import { HttpStatusCodeEnum } from '@/@core/enums/http-status-code';

import { GuestSignUpBodyDto } from '@/modules/guests/infra/drivers/http/rest/dtos/guest-sign-up.dto';

import { OpenApiRoute } from '@/shared/libs/swagger/openapi';

export function GuestSignUpSwaggerRoute() {
	return OpenApiRoute({
		operation: {
			description: 'Register a new guest',
			tags: ['sign-up', 'guest'],
			deprecated: false,
		},
		body: {
			type: GuestSignUpBodyDto,
		},
		queries: [
			{
				name: 'token',
				example:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ3Vlc3QiLCJzdWIiOiJlSEZqTUhGdGVESnlkbXR6Y1had2VERnliMll4WjJoa09uRXlNbmx0ZFhBMGRtTjZOM0ZyT0RKM01uWXpNVzB6TXpwMGIzSnlaWE50YVhKaGJtUmhMbkpxUUdkdFlXbHNMbU52YlE9PSIsImlhdCI6MTczMjc0NDA2MCwiZXhwIjoxNzMyOTE2ODYwfQ.RmyaogouBwRoYlgfR7KMfnMfM2jYoBiB_M_J2Dwqb8A',
				required: true,
			},
		],
		responses: [
			{
				status: HttpStatusCodeEnum.CREATED,
				description: 'Guest successfully registered',
			},
		],
	});
}
