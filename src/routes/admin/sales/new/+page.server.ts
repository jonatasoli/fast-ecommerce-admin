import { SERVER_BASE_URL } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const order_id = new URL(url).searchParams.get('order_id') || '';
	const res = await fetch(`${SERVER_BASE_URL}/order/${order_id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const data = await res.json();
	return {
		orders: data,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
