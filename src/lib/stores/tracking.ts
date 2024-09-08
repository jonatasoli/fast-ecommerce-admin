import { writable } from 'svelte/store';

export type Tracking = {
	tracking_id: number;
	order_id: number;
	tracking_number: string;
	status: string;
	updated_at: string;
	errors: string | null;
	loading: boolean;
};

const initialTracking: Tracking = {
	tracking_id: 0,
	order_id: 0,
	tracking_number: '',
	status: '',
	updated_at: '',
	errors: null,
	loading: false
};

export const trackingStore = writable<Tracking>(initialTracking);

trackingStore.request = async (method, url, params = {}, token) => {
	trackingStore.update((data) => {
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
		trackingStore.set({
			tracking_id: json?.tracking_id ?? 0,
			order_id: json?.order_id ?? 0,
			tracking_number: json?.tracking_number ?? '',
			status: json?.status ?? '',
			updated_at: json?.updated_at ?? '',
			errors: null,
			loading: false
		});
	} else {
		trackingStore.update((data) => {
			data.loading = false;
			data.errors = json.errors;
			return data;
		});
	}
};

trackingStore.get = (order_id, token) => trackingStore.request('GET', `/order/${order_id}/tracking_number`, token);
trackingStore.post = (order_id, params, token) => trackingStore.request('POST', `/order/${order_id}/tracking_number`, params, token);
trackingStore.patch = (order_id, params, token, tracking_number) => trackingStore.request('PATCH', `/order/${order_id}/tracking_number`, params, token,tracking_number);
trackingStore.delete = (order_id, params, token) => trackingStore.request('DELETE', `/order/${order_id}/tracking_number`, params, token);
