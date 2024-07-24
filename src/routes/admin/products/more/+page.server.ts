import { SERVER_BASE_URL } from '$env/static/private';
import { productEdit } from '$lib/schemas/product';
import type { Category } from '$lib/types';
import { generateURI } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const product_id = new URL(url).searchParams.get('product_id') ?? '1';
	const token = cookies.get('access_token');
	const fetchCategories = async (): Promise<{ categories: Category[] }> => {
		const res = await fetch(`${SERVER_BASE_URL}/catalog/categories`);
		const data = await res.json();
		return data;
	};

	const receivedCategories = await fetchCategories();
	const fetchProduct = async (): Promise<DataProduct> => {
		const res = await fetch(`${SERVER_BASE_URL}/product/${product_id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		return data;
	};

	const receivedProduct = await fetchProduct();
	const form = await superValidate(zod(productEdit), {
		data: receivedProduct
	});
	return {
		categories: receivedCategories.categories,
		product: receivedProduct,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const form = await superValidate(request, zod(productEdit));

		if (!form.valid) {
			delete form.data.image;
			console.log(form);
			return fail(400, { form });
		}
		console.log('productid');
		console.log(form.data.product_id);
		console.log('ativo');
		console.log(form.data.active);
		const payload = {
			name: form.data.name,
			active: form.data.active,
			sku: form.data.sku,
			weight: form.data.weight,
			height: form.data.height,
			width: form.data.width,
			length: form.data.length,
			price: form.data.price,
			uri: generateURI(form.data.name),
			category_id: form.data.category
		};
		if (form.data.content || form.data.composition || form.data.howToUse) {
			payload.description = {
				content: form.data.content,
				composition: form.data.composition,
				how_to_use: form.data.howToUse
			};
		}
		console.log(payload);

		const body = JSON.stringify(payload);
		console.log('corpo');
		console.log(body);
		const res = await fetch(`${SERVER_BASE_URL}/product/${form.data.product_id}`, {
			method: 'PATCH',
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

		if (form.data.image) {
			const formData = new FormData();
			formData.append('image', form.data.image);
			const res = await fetch(`${SERVER_BASE_URL}/product/upload-image/${form.data.product_id}`, {
				method: 'POST',
				body: formData
			});

			const imageData = await res.json();

			if (imageData && res.status == 204) {
				delete form.data.image;
				return {
					success: true,
					form
				};
			}
		} else {
			if (res.status == 204) {
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
