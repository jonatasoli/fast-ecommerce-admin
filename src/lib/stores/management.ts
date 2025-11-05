import { writable } from 'svelte/store';

interface UsersState {
	users: Array<any>;
	page: number;
	limit: number;
	total_pages: number;
	total_records: number;
	loading?: boolean;
	errors?: any;
}

export function usersStore() {
	const store = writable<UsersState>({
		users: [],
		page: 1,
		limit: 10,
		total_pages: 0,
		total_records: 0,
		loading: false,
		errors: null
	});


	store.request = async (method: string, url: string, params = {}, token: string) => {

		store.update((data) => {
			data.loading = true;
			data.errors = null;
			return data;
		});

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		};

		
		const body = ['POST', 'PATCH', 'DELETE'].includes(method) ? JSON.stringify(params) : undefined;

		try {
		
			const response = await fetch(url, { method, body, headers });

		
			let json: any;
			if (response.status !== 204) {
				json = await response.json();
			}

		
			if (response.ok) {
				store.update((data) => ({ ...data, ...json, loading: false }));
				return json; 
			} else {
				
				throw new Error(json?.errors || 'Erro desconhecido');
			}
		} catch (error) {
			
			store.update((data) => {
				data.loading = false;
				data.errors = error.message;
				return data;
			});
			console.error('Erro na requisição:', error);
			throw error; 
		}
	};

	
	store.get = (url: string, token: string) => store.request('GET', url, {}, token);
	store.post = (url: string, params: any, token: string) =>
		store.request('POST', url, params, token);
	store.patch = (url: string, params: any, token: string) =>
		store.request('PATCH', url, params, token);
	store.delete = (url: string, params: any, token: string) =>
		store.request('DELETE', url, params, token);

	return store;
}
