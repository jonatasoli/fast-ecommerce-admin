import { SERVER_BASE_URL } from '$env/static/private';
import type { DataProducts } from '$lib/types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const fetchProducts = async (): Promise<DataProducts> => {
		const res = await fetch(`${SERVER_BASE_URL}/product/inventory?offset=${offset}&page=${page}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		return data;
	};

	const receivedProducts = await fetchProducts();
	return {
		products: receivedProducts.inventory,
		page: receivedProducts.page,
		offset: receivedProducts.offset,
		totalPages: receivedProducts.total_pages,
		totalRecords: receivedProducts.total_records
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');

		const page = new URL(url).searchParams.get('page') || 1;
		const offset = new URL(url).searchParams.get('offset') || 10;
		const fetchProducts = async (): Promise<DataProducts> => {
			const res = await fetch(
				`${SERVER_BASE_URL}/product/inventory?offset=${offset}&page=${page}`,
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
		const receivedProducts = await fetchProducts();

		return {
			products: receivedProducts.inventory,
			page: receivedProducts.page,
			offset: receivedProducts.offset,
			totalPages: receivedProducts.total_pages,
			totalRecords: receivedProducts.total_records
		};
	}
};
