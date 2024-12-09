import { SERVER_BASE_URL } from '$env/static/private';
import { ordersStore } from '$lib/stores/sales';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const token = cookies.get('access_token');
	await ordersStore.get(
		`${SERVER_BASE_URL}/report/commissions
?page=${page}&offset=${offset}`,
		token
	);
	let currentOrders;
	ordersStore.subscribe((value) => (currentOrders = value))();

	return {
		orders: currentOrders,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
