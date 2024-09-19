import { writable } from 'svelte/store';

interface UsersState {
	users: Array<any>;
	page: number;
	offset: number;
	total_pages: number;
	total_records: number;
	loading?: boolean;
	errors?: any;
}

export function usersStore() {
	const store = writable<UsersState>({
		users: [],
		page: 1,
		offset: 10,
		total_pages: 0,
		total_records: 0,
		loading: false,
		errors: null
	});

	// Função genérica para realizar requisições
	store.request = async (method: string, url: string, params = {}, token: string) => {
		// Atualiza o estado da store para "carregando"
		store.update((data) => {
			data.loading = true;
			data.errors = null; // Limpa erros anteriores
			return data;
		});

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		};

		// Define o corpo da requisição apenas para métodos POST, PATCH e DELETE
		const body = ['POST', 'PATCH', 'DELETE'].includes(method) ? JSON.stringify(params) : undefined;

		try {
			// Faz a requisição
			const response = await fetch(url, { method, body, headers });

			// Verifica se a resposta tem conteúdo, caso contrário não chama `.json()`
			let json: any;
			if (response.status !== 204) {
				json = await response.json();
			}

			// Atualiza a store caso a requisição tenha sido bem-sucedida
			if (response.ok) {
				store.update((data) => ({ ...data, ...json, loading: false }));
				return json; // Retorna o JSON caso precise utilizá-lo
			} else {
				// Lança erro caso o status da resposta não seja OK
				throw new Error(json?.errors || 'Erro desconhecido');
			}
		} catch (error) {
			// Atualiza o estado de erro na store
			store.update((data) => {
				data.loading = false;
				data.errors = error.message;
				return data;
			});
			console.error('Erro na requisição:', error);
			throw error; // Repassa o erro para o chamador
		}
	};

	// Definição dos métodos HTTP
	store.get = (url: string, token: string) => store.request('GET', url, {}, token);
	store.post = (url: string, params: any, token: string) =>
		store.request('POST', url, params, token);
	store.patch = (url: string, params: any, token: string) =>
		store.request('PATCH', url, params, token);
	store.delete = (url: string, params: any, token: string) =>
		store.request('DELETE', url, params, token);

	return store;
}
