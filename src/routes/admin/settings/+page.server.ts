import { SERVER_BASE_URL } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export const load = async ({ cookies }) => {
	const token = cookies.get('access_token');

	return {
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
