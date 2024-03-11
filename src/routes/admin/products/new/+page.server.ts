import { SERVER_BASE_URL } from '$env/static/private';
import { productSchema } from '$lib/schemas/product';
import type { Category } from '$lib/types';
import { generateURI } from '$lib/utils';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

/** @type {import('./$types').PageLoad} */
export const load = async () => {
	const fetchCategories = async (): Promise<{ categories: Category[] }> => {
		const res = await fetch(`${SERVER_BASE_URL}/catalog/categories`);
		const data = await res.json();
		return data;
	};

	const receivedCategories = await fetchCategories();

	const form = await superValidate(zod(productSchema));

	return {
		categories: receivedCategories.categories,
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(productSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const payload = {
			...form.data,
			uri: generateURI(form.data.name),
			installments_config: 1,
			category_id: form.data.category,
			image_path: '',
			active: true,
			description: {},
			sku: '',
		};

		console.log(payload)
		const res = await fetch(`${SERVER_BASE_URL}/product/create-product`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		
		const data = await res.json();
		console.log(data.detail);
		if (data.uri) {
			return {
				success: true
			};
		}
		return fail(422, {
			success: false
		})
	}
};
