export type DateType = Date | number;

export type AddSecondsToDateOptions = {
	date: DateType;
	amount: number;
};

export type DifferenceInDaysOptions = {
	from: DateType;
	to: DateType;
};

export type ConvertTimestampToDateStringOptions = {
	day: '2-digit' | 'numeric';
	month: '2-digit' | 'long' | 'narrow' | 'numeric' | 'short';
	year: '2-digit' | 'numeric';
	hour: '2-digit' | 'numeric';
	minute: '2-digit' | 'numeric';
};

export abstract class DateService {
	abstract addSeconds(opts: AddSecondsToDateOptions): Date;
	abstract convertTimestampToDateString(
		timestamp: number,
		opts?: ConvertTimestampToDateStringOptions,
	): string;
	abstract differenceInDays(opts: DifferenceInDaysOptions): number;
	abstract fromUnixTimestamp(timestamp: number): Date;
	abstract toUnixTimestamp(date: Date): number;

	abstract now(): Date;
}
