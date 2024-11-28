import { Repository } from '@/@core/application/repository';

import { GuestEntity } from '@/modules/guests/domain/guest.entity';

export abstract class GuestsRepository extends Repository<GuestEntity> {}
