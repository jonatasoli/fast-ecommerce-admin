import { SERVER_BASE_URL } from '$env/static/private';
import type { Actions } from '@sveltejs/kit';
import { productsStore } from '$lib/stores/product.js';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const products = productsStore();

	await products.get(`${SERVER_BASE_URL}/product/inventory?offset=${offset}&page=${page}`, token);

	let currentProducts;
	products.subscribe((value) => (currentProducts = value))();

	return {
		products: currentProducts,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');

		
		const formData = await request.formData();
		const query = formData.get('query') || '';

		const res = await fetch(`${SERVER_BASE_URL}/product/products/${query}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) {
			throw new Error('Failed to fetch products');
		}

		const data = await res.json();
		console.log(data.inventory);
		return data.inventory;
	}
};
