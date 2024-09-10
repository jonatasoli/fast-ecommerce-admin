import { SERVER_BASE_URL } from '$env/static/private';
import { logisticStore } from '$lib/stores/logistic';
import type { DataOrders } from '$lib/types';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const logistic = logisticStore();
	await logistic.get(`${SERVER_BASE_URL}/order/orders?offset=${offset}&page=${page}`, token);

	let currentLogistic;
	logistic.subscribe((value) => (currentLogistic = value))();
	console.log(currentLogistic);

	return {
		orders: currentLogistic,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
export const actions: Actions = {
	updateTracking: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const form = await request.formData();

		const data = {
			order_id: form.get('order_id'),
			tracking_number: form.get('tracking_number')
		};

		const { order_id, tracking_number } = data;

		const res = await fetch(`${SERVER_BASE_URL}/order/${order_id}/tracking_number`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ tracking_number })
		});

		if (!res.ok) {
			return fail(res.status, { error: 'Failed to update tracking number' });
		}

		return {
			success: true
		};
	},

	fetchOrders: async ({ url, cookies }) => {
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
			if (!res.ok) {
				throw new Error('Failed to fetch orders');
			}
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
