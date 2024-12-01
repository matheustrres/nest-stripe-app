import { Repository } from '@/@core/application/repository';

import { ChatEntity } from '@/modules/chats/domain/chat.entity';

export abstract class ChatsRepository extends Repository<ChatEntity> {
	abstract findByName(name: string): Promise<ChatEntity | null>;
	abstract findByOwnerId(ownerId: string): Promise<ChatEntity | null>;
}
