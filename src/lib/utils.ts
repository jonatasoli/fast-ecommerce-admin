import { CURRENCIES, LOCALES } from './enums';

export function generateURI(productName: string) {
	return productName
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-');
}

export function currencyFormat(
	value: number | undefined | null,
	locale = LOCALES.PT_BR,
	type = ''
): string {
	const currency = CURRENCIES[locale] || LOCALES.PT_BR;

	const { format } = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency
	});

	if (!value) {
		return format(0);
	}

	if (type === 'freight') {
		return format(value);
	}

	return format(value);
}
