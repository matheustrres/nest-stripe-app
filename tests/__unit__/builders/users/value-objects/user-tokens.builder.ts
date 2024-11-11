import {
	UserTokensValueObject,
	UserTokensValueObjectProps,
} from '@/modules/users/domain/value-objects/tokens';

import { FakerLib } from '#/__unit__/!libs/faker';

export class UserTokensValueObjectBuilder {
	#props: UserTokensValueObjectProps = {
		amount: FakerLib.number.float(),
	};

	setAmount(amount: number): this {
		this.#props.amount = amount;
		return this;
	}

	build(): UserTokensValueObject {
		return new UserTokensValueObject(this.#props.amount);
	}
}
