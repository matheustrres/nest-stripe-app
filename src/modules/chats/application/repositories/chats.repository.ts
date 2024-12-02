import { Repository } from '@/@core/application/repository';
import { OrderByEnum } from '@/@core/types';

import { ChatEntity } from '@/modules/chats/domain/chat.entity';
import { MessageEntity } from '@/modules/chats/domain/message.entity';

export type ListOptions = {
	relations?: {
		messageResponse?: boolean;
	};
	orderBy?: OrderByEnum;
};

export abstract class ChatsRepository extends Repository<ChatEntity> {
	abstract findByName(name: string): Promise<ChatEntity | null>;
	abstract findByOwnerId(
		chatId: string,
		ownerId: string,
	): Promise<ChatEntity | null>;
	abstract listChatMessages(
		chatId: string,
		options?: ListOptions,
	): Promise<MessageEntity[]>;
}
