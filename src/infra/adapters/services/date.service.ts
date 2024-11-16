import { Injectable } from '@nestjs/common';
import * as dateFns from 'date-fns';

import {
	AddSecondsToDateOptions,
	DateService,
	DifferenceInDaysOptions,
} from '@/@core/application/services/date.service';

@Injectable()
export class DateFnsDateServiceAdapter implements DateService {
	addSeconds({ amount, date }: AddSecondsToDateOptions): Date {
		return dateFns.addSeconds(date, amount);
	}

	differenceInDays({ from, to }: DifferenceInDaysOptions): number {
		const fromDate = new Date(dateFns.toDate(from));
		const toDate = new Date(dateFns.toDate(to));

		const fromDateDayStartsAt = this.#getDateDayStart(fromDate);
		const toDateDayStarsAt = this.#getDateDayStart(toDate);

		return dateFns.differenceInDays(toDateDayStarsAt, fromDateDayStartsAt);
	}

	fromUnixTimestamp(timestamp: number): Date {
		return dateFns.fromUnixTime(timestamp);
	}

	now(): Date {
		return new Date();
	}

	toUnixTimestamp(date: Date): number {
		return dateFns.getUnixTime(date);
	}

	#getDateDayStart(date: Date): Date {
		return dateFns.startOfDay(date.toISOString().slice(0, 10));
	}
}
