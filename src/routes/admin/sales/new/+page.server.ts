import { SERVER_BASE_URL } from '$env/static/private';
import { ordersStore } from '$lib/stores/sales';

/** @type {import('./$types').PageLoad} */
export const load = async ({ cookies }) => {
	const token = cookies.get('access_token');
	// gambiarra
	await ordersStore.get(`${SERVER_BASE_URL}/order/orders?page=1&offset=1000`, token);
	let currentOrders;
	ordersStore.subscribe((value) => (currentOrders = value))();

	return {
		orders: currentOrders,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
