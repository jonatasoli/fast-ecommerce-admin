import { SERVER_BASE_URL } from '$env/static/private';
import { productsStore } from '$lib/stores/product';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 100;
	const token = cookies.get('access_token');
	const products = productsStore();

	await products.get(`${SERVER_BASE_URL}/product/inventory?page=${page}&offset=${offset}`, token);
	let currentProducts;
	products.subscribe((value) => (currentProducts = value))();

	return {
		products: currentProducts,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const formData = await request.formData();
		const transaction = Object.fromEntries(formData.entries());
		const products = productsStore();

		await products.post(
			`${SERVER_BASE_URL}/product/inventory/${transaction.product_id}/transaction`,
			transaction,
			token
		);
		let currentInventory;
		products.subscribe((value) => (currentInventory = value))();

		return {
			status: 200,
			body: {
				message: 'Transaction created successfully',
				inventory: currentInventory
			}
		};
	}
};
