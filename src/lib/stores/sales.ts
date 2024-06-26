import { writable } from 'svelte/store';

export type Order = {
	order_id: string;
	affiliate_id?: string;
	order_date: string;
	discount?: number;
	tracking_number?: string;
	order_status: string;
	user: {
		user_id: string;
		name: string;
		email: string;
	};
	freight?: string;
	coupon_id?: string;
	cancelled_reason?: string;
	cancelled_at?: string;
};

export type Orders = {
	orders: Order[];
	page: number;
	offset: number;
	totalPages: number;
	totalRecords: number;
	loading: boolean;
	errors: string | null;
};

const initialOrders: Orders = {
	orders: [],
	page: 1,
	offset: 10,
	totalPages: 0,
	totalRecords: 0,
	loading: false,
	errors: null
};

export const ordersStore = writable<Orders>(initialOrders);

//TODO: Aqui então eu preciso ter funções separadas para o CRUD e elas mexem com o state

export function getOrderById(orderId: string, orders: Order[]): Order | undefined {
	return orders.find((order) => order.order_id === parseInt(orderId));
}

ordersStore.request = async (method, url, params = {}, token) => {
	ordersStore.update((data) => {
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
		ordersStore.set({
			orders: json.orders,
			page: json.page,
			offset: json.offset,
			totalPages: json.total_pages,
			totalRecords: json.total_records
		});
	} else {
		ordersStore.update((data) => {
			console.log('dados');
			console.log(data);
			data.loading = false;
			data.errors = json.errors;
			return data;
		});
	}
};

ordersStore.get = (url, token) => ordersStore.request('GET', url, token);
ordersStore.post = (url, params, token) => ordersStore.request('POST', url, params, token);
ordersStore.patch = (url, params, token) => ordersStore.request('PATCH', url, params, token);
ordersStore.delete = (url, params, token) => ordersStore.request('DELETE', url, params, token);
