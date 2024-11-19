import { Injectable } from '@nestjs/common';
import * as dateFns from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

import {
	AddSecondsToDateOptions,
	ConvertTimestampToDateStringOptions,
	DateService,
	DifferenceInDaysOptions,
} from '@/@core/application/services/date.service';

dateFns.setDefaultOptions({
	locale: ptBR,
});

@Injectable()
export class DateFnsDateServiceAdapter implements DateService {
	addSeconds({ amount, date }: AddSecondsToDateOptions): Date {
		return dateFns.addSeconds(date, amount);
	}

	convertTimestampToDateString(
		timestamp: number,
		opts?: ConvertTimestampToDateStringOptions,
	): string {
		const formatOptions = {
			day: opts?.day ?? 'numeric',
			hour: opts?.hour ?? '2-digit',
			minute: opts?.minute ?? '2-digit',
			month: opts?.month ?? 'long',
			year: opts?.year ?? 'numeric',
		};
		const date = dateFns.toDate(timestamp * 1000);
		return new Intl.DateTimeFormat('pt-BR', formatOptions).format(date);
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
