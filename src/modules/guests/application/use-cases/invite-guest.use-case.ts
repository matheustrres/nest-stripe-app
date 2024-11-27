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
import { UserEntity } from '@/modules/users/domain/user.entity';

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
	readonly #TWO_DAYS_INVITE_TOKEN_EXPIRATION_TIME_IN_SECS = 172_800;

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

		this.#validateUserCanIssueAnInvitation(owner);

		const ownerSubscription = owner.getProps().subscription!;

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
			expiresAt: this.#getInviteExpirationDate(),
			ownerId: owner.id,
			status: InviteStatusEnum.Pending,
		});
		await this.invitesRepository.upsert(invite);

		this.eventEmitter.emit(
			new GuestInvitedDomainEvent({
				name: guestName,
				email: guestEmail,
				inviteExpirationTimeInSeconds:
					this.#TWO_DAYS_INVITE_TOKEN_EXPIRATION_TIME_IN_SECS,
				inviteId: invite.id.value,
				ownerId: owner.id.value,
				ownerName: owner.getProps().name,
			}),
		);

		return {
			invite,
		};
	}

	#validateUserCanIssueAnInvitation(user: UserEntity): void {
		const { role, subscription } = user.getProps();
		if (
			role !== RoleEnum.Owner ||
			!subscription ||
			subscription.getProps().status.isCanceled()
		)
			throw new InvalidCredentialsError('Not allowed.');
	}

	async #validateUserGuestsCountLimit(
		userId: string,
		currentPlan: FullVendorPlanDetails,
	): Promise<void> {
		const actualCount = await this.usersRepository.countUserGuests(userId);
		if (actualCount >= currentPlan.allowedMembers)
			throw InvalidInvitationActionError.byExceededPlanMaxInvitations();
	}

	#getInviteExpirationDate(): Date {
		const now = this.dateService.now();
		return this.dateService.addSeconds({
			amount: this.#TWO_DAYS_INVITE_TOKEN_EXPIRATION_TIME_IN_SECS,
			date: now,
		});
	}
}
