import type { PageLoad } from './invoices/$types';

export const load: PageLoad = async ({ cookies }) => {
	const token = cookies.get('access_token');
	const role = cookies.get('role');

	return {
		token,
		role
	};
};
