import { goto } from '$app/navigation';
import { SERVER_BASE_URL } from '$env/static/private';
import { productEdit } from '$lib/schemas/product';
import type { Category, DataProduct } from '$lib/types';
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

	async function fetchMedias(uri: string) {
		const res = await fetch(`${SERVER_BASE_URL}/product/media/${uri}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		return data;
	}

	const receivedProduct = await fetchProduct();

	const medias = await fetchMedias(receivedProduct.uri);

	const form = await superValidate(zod(productEdit), {
		data: receivedProduct
	});
	return {
		categories: receivedCategories.categories,
		product: receivedProduct,
		form,
		medias,
		base_url: `${SERVER_BASE_URL}`,
		token
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const formData = await request.formData();
		const files = formData.getAll('images[]');

		const form = await superValidate(formData, zod(productEdit));

		if (!form.valid) {
			delete form.data.image;
			return fail(400, { form });
		}

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

		const body = JSON.stringify(payload);

		const res = await fetch(`${SERVER_BASE_URL}/product/${form.data.product_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body
		});

		if (form.data.image) {
			const formDataImage = new FormData();
			formDataImage.append('image', form.data.image);

			const uploadRes = await fetch(
				`${SERVER_BASE_URL}/product/upload-image/${form.data.product_id}`,
				{
					method: 'POST',
					body: formDataImage
				}
			);

			const imageData = await uploadRes.json();

			if (imageData && uploadRes.status === 204) {
				delete form.data.image;
				return {
					success: true,
					form
				};
			}
		}

		if (files && files.length > 0) {
			const uploads = files.map(async (file, index) => {
				try {
					const mediaType = file.type.startsWith('image/')
						? 'PHOTO'
						: file.type.startsWith('video/')
							? 'VIDEO'
							: 'UNKNOWN';

					if (mediaType === 'UNKNOWN') {
						console.error(`Arquivo ${file.name} não é nem imagem nem vídeo.`);
						return;
					}

					const formData = new FormData();
					formData.append('new_media', file);

					const url = `${SERVER_BASE_URL}/product/media/${form.data.product_id}?media_type=${mediaType}&order=${index}`;

					const mediaRes = await fetch(url, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`
						},
						body: formData
					});

					if (mediaRes.ok) {
						const resposta = await mediaRes.json();
						console.log(`✅ Upload OK: ${file.name}`, resposta);
					} else {
						const error = await mediaRes.json();
						console.error(`❌ Upload falhou: ${file.name}`, error.message || 'Erro desconhecido');
					}
				} catch (err) {
					console.error(`❌ Erro inesperado ao enviar ${file.name}:`, err);
				}
			});

			await Promise.allSettled(uploads);

			delete form.data.image;

			return {
				success: true,
				form
			};
		}

		if (res.status === 204 || res.status === 200) {
			delete form.data.image;
			return {
				success: true,
				form
			};
		}

		// Algo deu errado
		delete form.data.image;
		return fail(422, {
			success: false,
			form
		});
	}
};
