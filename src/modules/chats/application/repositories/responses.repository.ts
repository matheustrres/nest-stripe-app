import { Repository } from '@/@core/application/repository';

import { ResponseEntity } from '@/modules/chats/domain/response.entity';

export abstract class ResponsesRepository extends Repository<ResponseEntity> {
	abstract findByMessageId(messageId: string): Promise<ResponseEntity | null>;
}
