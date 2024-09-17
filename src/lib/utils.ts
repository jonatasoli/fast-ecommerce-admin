import { CURRENCIES, LOCALES } from './enums';

export function formatDocument(document: string) {
	// Verifica se já está formatado (document no formato ###.###.###-##)
	if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(document)) {
		return document;
	}

	// Remove qualquer caractere que não seja número
	document = document.replace(/\D/g, '');

	// Se o document tiver 11 dígitos, aplica a máscara de document (###.###.###-##)
	if (document.length === 11) {
		return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	// Retorna o document não formatado se não tiver o número correto de dígitos
	return document;
}

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

export function getRoleName(roleId: number): string {
	switch (roleId) {
		case 1:
			return 'Admin';
		case 2:
			return 'User';
		case 3:
			return 'Partner';
		default:
			return 'Unknown';
	}
}

export function setRoleId(roleName: string): number {
	switch (roleName.toUpperCase()) {
		case 'ADMIN':
			return 1;
		case 'USER':
			return 2;
		case 'PARTNER':
			return 3;
		default:
			return 0;
	}
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
