import { ResponseEntity } from '@/modules/chats/domain/response.entity';

export type ResponseHttpResponse = {
	id: string;
	content: string;
	model: string;
	createdAt: Date;
};

export class ResponseViewModel {
	static toHttp(response: ResponseEntity): ResponseHttpResponse {
		const { content, model } = response.getProps();

		return {
			id: response.id.value,
			content,
			model,
			createdAt: response.createdAt,
		};
	}
}
