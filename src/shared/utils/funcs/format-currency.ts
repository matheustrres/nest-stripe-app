export function formatCurrencyFromCents(
	amountInCents: number,
	currency = 'BRL',
) {
	const amountInReais = amountInCents / 100;
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currencyDisplay: 'symbol',
		currency,
	}).format(amountInReais);
}
