import { SERVER_BASE_URL } from '$env/static/private';
import { commissionsStore } from '$lib/stores/commissions';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const commission = commissionsStore();
	await commission.get(
		`${SERVER_BASE_URL}/report/commissions
`,
		token
	);
	let currentCommissions;

	commission.subscribe((value) => (currentCommissions = value))();

	return {
		commissions: currentCommissions,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};
