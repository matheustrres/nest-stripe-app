import { Injectable } from '@nestjs/common';

import { InvalidCredentialsError } from '@/@core/application/errors/invalid-credentials.error';
import { DateService } from '@/@core/application/services/date.service';
import { TokenizationService } from '@/@core/application/services/tokenization.service';
import { UseCase } from '@/@core/application/use-case';
import { RoleEnum } from '@/@core/enums/user-role';
import { GuestSignUpTokenSubType } from '@/@core/types';

import { InvalidGuestSignUpActionError } from '@/modules/guests/application/errors/invalid-guest-sign-up-action.error';
import { InviteNotFoundError } from '@/modules/guests/application/errors/invite-not-found.error';
import { GuestsRepository } from '@/modules/guests/application/repositories/guests.repository';
import { InvitesRepository } from '@/modules/guests/application/repositories/invites.repository';
import { InviteStatusEnum } from '@/modules/guests/domain/enums/invite-status';
import {
	GuestEntity,
	GuestEntityProps,
} from '@/modules/guests/domain/guest.entity';
import { InviteEntity } from '@/modules/guests/domain/invite.entity';
import { UserAlreadyExistsError } from '@/modules/users/application/errors/user-already-exists.error';
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found.error';
import { UsersRepository } from '@/modules/users/application/repositories/users.repository';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UserEntity } from '@/modules/users/domain/user.entity';

export type GuestSignUpUseCaseInput = {
	token: string;
	name: string;
	password: string;
};

export type GuestSignUpUseCaseOutput = {
	user: UserEntity;
};

@Injectable()
export class GuestSignUpUseCase
	implements UseCase<GuestSignUpUseCaseInput, GuestSignUpUseCaseOutput>
{
	constructor(
		private readonly dateService: DateService,
		private readonly guestsRepository: GuestsRepository,
		private readonly invitesRepository: InvitesRepository,
		private readonly tokenizationService: TokenizationService,
		private readonly usersRepository: UsersRepository,
		private readonly usersService: UsersService,
	) {}

	async exec({
		token,
		name,
		password,
	}: GuestSignUpUseCaseInput): Promise<GuestSignUpUseCaseOutput> {
		const isIncomingTokenValid = this.tokenizationService.verify(token);
		if (!isIncomingTokenValid) {
			throw InvalidCredentialsError.byAuthenticationToken();
		}

		const { guestEmail, inviteId, ownerId } = this.#extractTokenData(token);

		const userAlreadyExistsByEmail =
			await this.usersRepository.findByEmail(guestEmail);
		if (userAlreadyExistsByEmail)
			throw UserAlreadyExistsError.byEmail(guestEmail);

		const invite = await this.invitesRepository.findOne(inviteId);
		if (!invite) throw InviteNotFoundError.byId(inviteId);

		this.#checkInvitationCanProceed(invite);

		const owner = await this.usersRepository.findById(ownerId);
		if (!owner) {
			throw UserNotFoundError.byId(ownerId);
		}

		let user: UserEntity;

		try {
			user = await this.usersService.createUser({
				name,
				email: guestEmail,
				password,
				role: RoleEnum.Guest,
			});
			user.confirmAccount();
		} catch (error) {
			throw new InvalidGuestSignUpActionError(
				'There was an error creating user. Please, try again later or contact the support.',
			);
		}

		await this.#linkGuestToInvite(
			{
				inviteId: invite.id,
				ownerId: owner.id,
				userId: user.id,
			},
			invite,
		);

		return {
			user,
		};
	}

	#checkInvitationCanProceed(invite: InviteEntity) {
		const { expiresAt, status } = invite.getProps();

		const isInviteStillPending = status === InviteStatusEnum.Pending;
		if (!isInviteStillPending)
			throw InvalidGuestSignUpActionError.byInviteAlreadyAcceptedOrDeclined();

		const isInviteExpirationTimeStillOnSchedule =
			expiresAt > this.dateService.now();
		if (!isInviteExpirationTimeStillOnSchedule) {
			throw InvalidGuestSignUpActionError.byInviteExpirationTimeOutOfDate();
		}
	}

	#extractTokenData(token: string): {
		ownerId: string;
		inviteId: string;
		guestEmail: string;
	} {
		const decodedToken = this.tokenizationService.decode(token);
		if (!decodedToken?.sub || decodedToken?.role !== RoleEnum.Guest)
			throw InvalidCredentialsError.byAuthenticationToken();

		const [ownerId, inviteId, guestEmail] = this.#decodeTokenSubData(
			decodedToken.sub,
		).split(':');
		if (!ownerId || !inviteId || !guestEmail)
			throw InvalidCredentialsError.byAuthenticationToken();

		return { ownerId, inviteId, guestEmail };
	}

	#decodeTokenSubData(sub: string): GuestSignUpTokenSubType {
		return Buffer.from(sub, 'base64').toString(
			'utf-8',
		) as GuestSignUpTokenSubType;
	}

	async #linkGuestToInvite(
		guestProps: GuestEntityProps,
		invite: InviteEntity,
	): Promise<void> {
		const guest = GuestEntity.createNew(guestProps);
		await this.guestsRepository.upsert(guest);

		invite.update({
			guestId: guest.id,
			status: InviteStatusEnum.Accepted,
		});
		await this.invitesRepository.upsert(invite);
	}
}
