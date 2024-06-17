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
			name: form.data.name,
			sku: form.data.sku,
			weight: form.data.weight,
			height: form.data.height,
			width: form.data.width,
			length: form.data.length,
			price: form.data.price,
			uri: generateURI(form.data.name),
			installments_config: 1,
			category_id: form.data.category,
			image_path: '',
			active: true,
			description: {
				content: form.data.content,
				composition: form.data.composition,
				how_to_use: form.data.howToUse
			}
		};

		const res = await fetch(`${SERVER_BASE_URL}/product/create-product`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const productData = await res.json();

		if (form.data.image) {
			const formData = new FormData();
			formData.append('image', form.data.image);
			const res = await fetch(`${SERVER_BASE_URL}/product/upload-image/${productData.product_id}`, {
				method: 'POST',
				body: formData
			});

			const imageData = await res.json();

			if (imageData && productData.uri) {
				return {
					success: true
				};
			}
		}

		return fail(422, {
			success: false
		});
	}
};
