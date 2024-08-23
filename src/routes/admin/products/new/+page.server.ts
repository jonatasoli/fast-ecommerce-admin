import { SERVER_BASE_URL } from '$env/static/private';
import { productSchema } from '$lib/schemas/product';
import type { Category } from '$lib/types';
import { generateURI } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
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
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const form = await superValidate(request, zod(productSchema));

		if (!form.valid) {
			delete form.data.image;
			console.log(form);
			return fail(400, { form });
		}
		const payload = {
			name: form.data.name,
            active: form.data.active,
            showcase: form.data.showcase,
            feature: form.data.feature,
            show_discount: form.data.show_discount,
			sku: form.data.sku,
			weight: form.data.weight,
			height: form.data.height,
			width: form.data.width,
			length: form.data.length,
			price: form.data.price,
			uri: generateURI(form.data.name),
			installments_config: 1,
			category_id: form.data.category,
			description: {
				content: form.data.content,
				composition: form.data.composition,
				how_to_use: form.data.howToUse
			}
		};
		console.log(payload);

		const body = JSON.stringify(payload);
		console.log(body);
		const res = await fetch(`${SERVER_BASE_URL}/product/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: body
		});
		console.log('Response Details:');
		console.log('Status:', res.status);
		console.log('Status Text:', res.statusText);
		console.log('Headers:', Array.from(res.headers.entries()));

		const productData = await res.json();
		console.log(productData);

		if (form.data.image) {
			const formData = new FormData();
			formData.append('image', form.data.image);
			const res = await fetch(`${SERVER_BASE_URL}/product/upload-image/${productData.product_id}`, {
				method: 'POST',
				body: formData
			});

			const imageData = await res.json();

			if (imageData && productData.uri) {
				delete form.data.image;
				return {
					success: true,
					form
				};
			}
		} else {
			if (productData.uri) {
				delete form.data.image;
				return {
					success: true,
					form
				};
			}
		}

		delete form.data.image;
		return fail(422, {
			success: false,
			form
		});
	}
};
