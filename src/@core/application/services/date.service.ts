export type DateType = Date | number;

export type AddSecondsToDateOptions = {
	date: DateType;
	amount: number;
};

export type DifferenceInDaysOptions = {
	from: DateType;
	to: DateType;
};

export abstract class DateService {
	abstract addSeconds(opts: AddSecondsToDateOptions): Date;
	abstract differenceInDays(opts: DifferenceInDaysOptions): number;
	abstract fromUnixTimestamp(timestamp: number): Date;
	abstract toUnixTimestamp(date: Date): number;

	abstract now(): Date;
}
