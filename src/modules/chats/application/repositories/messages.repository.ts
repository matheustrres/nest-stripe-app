import { Repository } from '@/@core/application/repository';

import { MessageEntity } from '@/modules/chats/domain/message.entity';

export abstract class MessagesRepository extends Repository<MessageEntity> {}
