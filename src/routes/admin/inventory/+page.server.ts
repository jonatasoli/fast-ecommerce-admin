import { SERVER_BASE_URL } from '$env/static/private';
import { createInventory } from '$lib/stores/inventory';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const token = cookies.get('access_token');
	const inventory_store = createInventory();
	await inventory_store.get(
		`${SERVER_BASE_URL}/product/inventory?page=${page}&offset=${offset}`,
		token
	);

	let currentInventory;
	inventory_store.subscribe((value) => (currentInventory = value))();
	console.log(currentInventory);

	return {
		inventory: currentInventory,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
