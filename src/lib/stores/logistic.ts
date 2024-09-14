import { writable } from 'svelte/store';

interface OrdersState {
	orders: Array<any>;
	page: number;
	offset: number;
	total_pages: number;
	total_records: number;
}

export function logisticStore() {
	const store = writable<OrdersState>({
		orders: [],
		page: 1,
		offset: 10,
		total_pages: 0,
		total_records: 0
	});
	store.request = async (method, url, params = {}, token) => {
		store.update((data) => {
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
			store.update((data) => ({ ...data, ...json, loading: false }));
		} else {
			store.update((data) => {
				console.log('dados');
				console.log(data);
				data.loading = false;
				data.errors = json.errors;
				return data;
			});
		}
	};

	store.get = (url, token) => store.request('GET', url, token);
	store.post = (url, params, token) => store.request('POST', url, params, token);
	store.patch = (url, params, token) => store.request('PATCH', url, params, token);
	store.delete = (url, params, token) => store.request('DELETE', url, params, token);

	return store;
}
