import { SERVER_BASE_URL } from '$env/static/private';
import type { DataProducts } from '$lib/types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const fetchLinks = async (): Promise<DataProducts> => {
		const res = await fetch(`${SERVER_BASE_URL}/user/affiliate`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		return data;
	};

	const receivedLinks = await fetchLinks();
	return {
		links: receivedLinks.urls
	};
};
