import { Repository } from '@/@core/application/repository';

import { InviteEntity } from '@/modules/guests/domain/invite.entity';

export abstract class InvitesRepository extends Repository<InviteEntity> {}
