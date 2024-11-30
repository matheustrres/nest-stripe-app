import { AiModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ResponseEntity } from '@/modules/chats/domain/response.entity';

import { ResponseEntityBuilder } from '#/__unit__/builders/chats/response.builder';

describe(ResponseEntity.name, () => {
	it('should create a new response', () => {
		const response = new ResponseEntityBuilder()
			.setContent('2 plus 2 is 4')
			.setModel(AiModelEnum.Gemini1_5Flash)
			.build();

		const { content, model } = response.getProps();

		expect(response).toBeDefined();
		expect(content).toBe('2 plus 2 is 4');
		expect(model).toBe('gemini-1.5-flash');
	});

	it('should restore a response', () => {
		const response = new ResponseEntityBuilder().build();
		const restoredResponse = ResponseEntity.restore({
			id: response.id,
			props: response.getProps(),
			createdAt: response.createdAt,
		});

		expect(restoredResponse).toBeDefined();
		expect(restoredResponse).toStrictEqual(response);
	});
});
