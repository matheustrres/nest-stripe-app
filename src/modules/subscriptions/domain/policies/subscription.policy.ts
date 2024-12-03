import { SubscriptionPolicyViolationError } from './errors/subscription-policy-violation.error';

import { Either } from '@/@core/domain/logic/either';

import { AIModelEnum } from '@/modules/chats/domain/enums/ai-model';
import { ChatTypeEnum } from '@/modules/chats/domain/enums/chat-type';

export abstract class SubscriptionPolicy {
	protected abstract readonly validAIModels: AIModelEnum[];
	protected abstract readonly validChats: ChatTypeEnum[];

	constructor(
		protected readonly aiModel: AIModelEnum,
		protected readonly chatType: ChatTypeEnum,
	) {}

	abstract validate(): Either<SubscriptionPolicyViolationError, void>;

	protected isValidAIModel(): boolean {
		return this.validAIModels.includes(this.aiModel);
	}

	protected isValidChat(): boolean {
		return this.validChats.includes(this.chatType);
	}
}
