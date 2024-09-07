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

export const statusMap: Record<string, string> = {
	PAYMENT_PENDING: 'Pendente',
	PAYMENT_PAID: 'Pago',
	PAYMENT_CANCELLED: 'Cancelado',
	PREPARING_ORDER: 'Preparando',
	SHIPPING_ORDER: 'Enviado',
	GENERATE_INVOICE: 'Nota gerada',
	SHIPPING_COMPLETE: 'Entregue'
  };
  
  /**
   * Retorna a tradução do status baseado no código do status.
   * @param statusCode - O código do status (ex: 'PAYMENT_PENDING')
   * @returns A tradução do status se encontrada, senão retorna o código original
   */
  export function getStatusTranslation(statusCode: string): string {
	return statusMap[statusCode] || statusCode;
  }
