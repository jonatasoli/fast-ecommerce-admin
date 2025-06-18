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
			console.log(form);
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
		// console.log(payload);

		const body = JSON.stringify(payload);
		// console.log('corpo');
		// console.log(body);
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
		} else if (files && files.length > 0) {
			files.forEach(async (file, index) => {
				try {
					// Verifica o tipo MIME do arquivo
					const mediaType = file.type.startsWith('image/')
						? 'PHOTO'
						: file.type.startsWith('video/')
							? 'VIDEO'
							: 'UNKNOWN'; // Pode adicionar um valor para outros tipos, se necessário

					if (mediaType === 'UNKNOWN') {
						console.error(`Arquivo ${file.name} não é nem imagem nem vídeo.`);
						return; // Se o tipo for desconhecido, não envia o arquivo
					}

					// Cria um FormData para o arquivo
					const formData = new FormData();
					formData.append('new_media', file); // 'new_media' é a chave esperada no backend

					// Envia o arquivo para a API com os parâmetros media_type e order
					const url = `${SERVER_BASE_URL}/product/media/${form.data.product_id}?media_type=${mediaType}&order=${index}`;

					// Log da requisição (antes de enviar)
					console.log('Requisição para URL:', url);
					console.log('Headers:', {
						Authorization: `Bearer ${token}`
					});

					// Envia a requisição
					const res = await fetch(url, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}` // Authorization header
						},
						body: formData
					});

					// Verifica a resposta da API
					if (res) {
						const resposta = await res.json();
						console.log('Resposta da API:', resposta);

						console.log(`Imagem ${file.name} enviada com sucesso!`);

						return {
							success: true,
							form
						};
					} else {
						const errorData = await res.json();
						console.error(
							`Erro ao fazer upload da imagem ${file.name}:`,
							errorData.message || 'Erro desconhecido'
						);
					}
				} catch (error) {
					console.error(`Erro no upload da imagem ${file.name}:`, error);
					// Continua para o próximo arquivo mesmo em caso de erro
				}
			});
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
