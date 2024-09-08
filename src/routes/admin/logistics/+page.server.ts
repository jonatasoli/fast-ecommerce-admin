import { SERVER_BASE_URL } from '$env/static/private';
import type { DataOrders } from '$lib/types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;

	const fetchOrders = async (): Promise<DataOrders> => {
		const res = await fetch(`${SERVER_BASE_URL}/order/orders?offset=${offset}&page=${page}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		return data;
	};

	const receivedOrders = await fetchOrders();
	return {
		orders: receivedOrders.orders,
		page: receivedOrders.page,
		offset: receivedOrders.offset,
		totalPages: receivedOrders.total_pages,
		totalRecords: receivedOrders.total_records
	};
};











export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');

		const page = new URL(url).searchParams.get('page') || 1;
		const offset = new URL(url).searchParams.get('offset') || 10;

		const fetchOrders = async (): Promise<DataOrders> => {
			const res = await fetch(
				`${SERVER_BASE_URL}/order/orders?offset=${offset}&page=${page}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}
			);
			const data = await res.json();
			return data;
		};

		const receivedOrders = await fetchOrders();

		return {
			orders: receivedOrders.orders,
			page: receivedOrders.page,
			offset: receivedOrders.offset,
			totalPages: receivedOrders.total_pages,
			totalRecords: receivedOrders.total_records
		};
	}

	
};


