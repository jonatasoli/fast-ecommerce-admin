import { SERVER_BASE_URL } from '$env/static/private';
import { couponsStore } from '$lib/stores/coupons';
import { parsePercentage } from '$lib/utils.js';
import { Actions, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ params, cookies }) => {
	const token = cookies.get('access_token');
	const coupon = params.coupon;
	const coupons = couponsStore();

	await coupons.get(`${SERVER_BASE_URL}/coupon/${coupon}`, token);
	let currentCoupon;
	coupons.subscribe((value) => (currentCoupon = value))();

	return {
		coupon: currentCoupon,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};

export const actions: Actions = {
	default: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const coupon = params.coupon;

		const couponData = {
			coupon_id: Number(coupon),
			code: formData.get('code') || null,
			user_id: formData.get('user_id') || null,
			product_id: formData.get('product_id') || null,
			discount: formData.get('discount') || '0',
			discount_price: formData.get('discount_price') || null,
			limit_price: formData.get('limit_price') || null,
			qty: Number(formData.get('qty')) || null,
			commission_percentage: formData.get('commission_percentage')
				? parsePercentage(formData.get('commission_percentage') as string)
				: null,

			active: formData.get('active') === 'Ativo' ? true : false
		};

		console.log(JSON.stringify(couponData));

		try {
			const response = await fetch(`${SERVER_BASE_URL}/coupon/${coupon}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(couponData)
			});

			if (!response.ok) {
				return fail(response.status, { error: 'Falha ao atualizar o cupom' });
			}

			console.log(response.error);

			return { success: true };
		} catch (error) {
			return fail(500, { error: 'Erro ao atualizar o cupom' });
		}
	}
};
