import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { UseCase } from '@/@core/application/use-case';
import { EnvService } from '@/@core/config/env/env.service';
import {
	FullVendorPlanDetails,
	VendorCatalogProductSectionsEnum,
} from '@/@core/domain/constants/vendor-products-catalog';
import { EventEmitter } from '@/@core/domain/events/emitter/event-emitter';
import { VendorProductsCatalogService } from '@/@core/domain/services/vendor-products-catalog.service';
import { RoleEnum } from '@/@core/enums/user-role';

import { InvalidInvitationActionError } from '@/modules/guests/application/errors/invite-invitation-action.error';
import { InvitesRepository } from '@/modules/guests/application/repositories/invites.repository';
import { InviteStatusEnum } from '@/modules/guests/domain/enums/invite-status';
import { GuestInvitedDomainEvent } from '@/modules/guests/domain/events/guest-invited.event';
import { InviteEntity } from '@/modules/guests/domain/invite.entity';
import { SubscriptionNotFoundError } from '@/modules/subscriptions/application/errors/subscription-not-found.error';
import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';

export type InviteGuestUseCaseInput = {
	guestName: string;
	guestEmail: string;
	ownerId: string;
};

export type InviteGuestUseCaseOutput = {
	invite: InviteEntity;
};

@Injectable()
export class InviteGuestUseCase
	implements UseCase<InviteGuestUseCaseInput, InviteGuestUseCaseOutput>
{
	constructor(
		private readonly dateService: DateService,
		private readonly envService: EnvService,
		private readonly eventEmitter: EventEmitter,
		private readonly usersRepository: UsersRepository,
		private readonly invitesRepository: InvitesRepository,
		private readonly productsCatalogService: VendorProductsCatalogService,
	) {}

	async exec({
		guestName,
		guestEmail,
		ownerId,
	}: InviteGuestUseCaseInput): Promise<InviteGuestUseCaseOutput> {
		const owner = await this.usersRepository.findById(ownerId, {
			relations: {
				subscription: true,
			},
		});
		if (!owner) throw new InvalidCredentialsError();

		const { role, subscription: ownerSubscription } = owner.getProps();

		if (role !== RoleEnum.Owner || !ownerSubscription)
			throw new InvalidCredentialsError('Not allowed.');

		const guest = await this.usersRepository.findByEmail(guestEmail);
		if (guest) throw UserAlreadyExistsError.byEmail(guestEmail);

		const currentEnvironment = this.envService.getKeyOrThrow('NODE_ENV');

		const ownerCurrentPlanFindingResult =
			this.productsCatalogService.getCatalogSessionProduct(
				VendorCatalogProductSectionsEnum.Plans,
				currentEnvironment,
				ownerSubscription.getProps().vendorProductId,
			);
		if (ownerCurrentPlanFindingResult.isLeft()) {
			throw SubscriptionNotFoundError.byCurrentSubscription(
				ownerSubscription.getProps().vendorSubscriptionId,
			);
		}

		await this.#validateUserGuestsCountLimit(
			owner.id.value,
			ownerCurrentPlanFindingResult.value,
		);

		const invite = InviteEntity.createNew({
			expiresAt: this.#getTokenExpirationDate(),
			ownerId: owner.id,
			status: InviteStatusEnum.Pending,
		});
		await this.invitesRepository.upsert(invite);

		this.eventEmitter.emit(
			new GuestInvitedDomainEvent({
				name: guestName,
				email: guestEmail,
			}),
		);

		return {
			invite,
		};
	}

	async #validateUserGuestsCountLimit(
		userId: string,
		currentPlan: FullVendorPlanDetails,
	): Promise<void> {
		const actualCount = await this.usersRepository.countUserGuests(userId);
		if (actualCount >= currentPlan.allowedMembers)
			throw InvalidInvitationActionError.byExceededPlanMaxInvitations();
	}

	#getTokenExpirationDate(): Date {
		const TWO_DAYS_IN_SECS = 172_800;
		const tokenExpiresAt = this.dateService.now();
		return this.dateService.addSeconds({
			amount: TWO_DAYS_IN_SECS,
			date: tokenExpiresAt,
		});
	}
}
