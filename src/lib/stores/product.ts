import { writable } from 'svelte/store';

export type Product = {
	product_id: number;
	name: string;
	uri: string;
	price: number;
	active: boolean;
	description: string;
	image_path: string;
	installments_config: number;
	discount: number;
	category_id: number;
	showcase: boolean;
	feature: boolean;
	show_discount: boolean;
	height: number;
	width: number;
	weight: number;
	lenght: number;
	diamenter: number;
	sku: string;
	currency: string;
};

export type Products = {
	products: Product[];
	page: number;
	offset: number;
	totalPages: number;
	totalRecords: number;
	loading: boolean;
	errors: string | null;
};

const initialProducts: Products = {
	products: [],
	page: 1,
	offset: 10,
	totalPages: 0,
	totalRecords: 0,
	loading: false,
	errors: null
};

export const productsStore = writable<Products>(initialProducts);

productsStore.request = async (method, url, params = {}, token) => {
	productsStore.update((data) => {
		delete data.errors;
		data.loading = true;
		return data;
	});

	const headers = {
		'Content-type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		Authorization: `Bearer ${token}`
	};
	const body =
		method === 'POST' || method === 'PATCH' || method === 'DELETE'
			? JSON.stringify(params)
			: undefined;

	const response = await fetch(`${url}`, { method, body, headers });
	const json = await response.json();

	if (response.ok) {
		productsStore.set({
			products: json?.inventory ?? '',
			page: json?.page ?? 1,
			offset: json?.offset ?? 1,
			totalPages: json?.total_pages ?? 1,
			totalRecords: json?.total_records ?? 1
		});
	} else {
		productsStore.update((data) => {
			console.log('dados');
			console.log(data);
			data.loading = false;
			data.errors = json.errors;
			return data;
		});
	}
};

productsStore.get = (url, token) => productsStore.request('GET', url, {}, token);
productsStore.post = (url, params, token) => productsStore.request('POST', url, params, token);
productsStore.patch = (url, params, token) => productsStore.request('PATCH', url, params, token);
productsStore.delete = (url, params, token) => productsStore.request('DELETE', url, params, token);
