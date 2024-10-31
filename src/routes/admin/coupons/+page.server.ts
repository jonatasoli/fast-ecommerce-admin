import { SERVER_BASE_URL } from '$env/static/private';
import { couponsStore } from '$lib/stores/coupons';
import type { Actions } from './$types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const coupons = couponsStore();

	await coupons.get(`${SERVER_BASE_URL}/coupon/?offset=${offset}&page=${page}`, token);

	let currentCoupons;
	coupons.subscribe((value) => (currentCoupons = value))();

	return {
		coupons: currentCoupons,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};

export const actions: Actions = {
	fetchUsers: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const coupons = couponsStore();
		const form = await request.formData();

		const data = {
			search_name: form.get('search_name'),
			offset: form.get('offset'),
			page: form.get('page')
		};

		const { offset, page, search_name } = data;

		await coupons.get(
			`${SERVER_BASE_URL}/coupon/?search_name=${search_name}&page=${page}&offset=${offset}`,
			token
		);

		let currentCoupons;
		coupons.subscribe((value) => (currentCoupons = value))();

		return {
			coupons: currentCoupons,
			access_token: token,
			base_url: `${SERVER_BASE_URL}`
		};
	}
};
