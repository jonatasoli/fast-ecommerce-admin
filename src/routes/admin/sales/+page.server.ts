
import { SERVER_BASE_URL } from '$env/static/private';
import type { DataInventory } from '$lib/types';
import { createSalesStore } from '$lib/stores/sales';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {

  const page = new URL(url).searchParams.get('page') || 1;
  const offset = new URL(url).searchParams.get('offset') || 10;
	const token =  cookies.get('access_token');
	const orders_store =  createSalesStore();
	await orders_store.get(`${SERVER_BASE_URL}/order/orders?page=${page}&offset=${offset}`, token )

	let currentOrders;
  orders_store.subscribe(value => currentOrders = value)();
  console.log('retorno');
  console.log(currentOrders);

	return {
		orders: currentOrders,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
