import { SERVER_BASE_URL } from '$env/static/private';
import type { Comissions } from '$lib/types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const fetchLinks = async (): Promise<Comissions> => {
		const res = await fetch(`${SERVER_BASE_URL}/report/user/comissions`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		console.log(data);
		return data;
	};

	const commissions = await fetchLinks();
	return {
		commissions: commissions.commissions
	};
};
