export function toNumber(value: unknown): number {
	return typeof value === 'string' ? parseFloat(value) : Number(value);
}
