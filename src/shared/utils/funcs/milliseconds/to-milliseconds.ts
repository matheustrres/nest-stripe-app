import { toNumber } from './to-number';
import { ToMillisecondsOptions } from './types';

export function toMilliseconds(opts?: ToMillisecondsOptions): number {
	const {
		days = 0,
		hours = 0,
		minutes = 0,
		seconds = 0,
		milliseconds = 0,
		microseconds = 0,
		nanoseconds = 0,
	} = opts || {};

	return (
		toNumber(days) * 864e5 +
		toNumber(hours) * 36e5 +
		toNumber(minutes) * 6e4 +
		toNumber(seconds) * 1e3 +
		toNumber(milliseconds) +
		toNumber(microseconds) / 1e3 +
		toNumber(nanoseconds) / 1e6
	);
}
