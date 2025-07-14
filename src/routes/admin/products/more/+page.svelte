<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import Input from '$lib/components/Input.svelte';
	import InputCurrency from '$lib/components/InputCurrency.svelte';
	import { notifications } from '$lib/notifications.js';
	import InputFile from '$lib/components/InputFile.svelte';
	import { Checkbox, Label, Select } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import Toast from '$lib/components/Toast.svelte';
	import InputMultipleFile from '$lib/components/InputMultipleFile.svelte';

	import { _ } from 'svelte-i18n';

	export let data;
	let loading = false;
	let content = '';
	let composition = '';
	let howToUse = '';
	let files: FileList;
	let multipleFiles: FileList;
	let selectedFiles: File[] = [];

	const MAX_IMAGE_SIZE_MB = 250;
	const MAX_VIDEO_SIZE_MB = 300;
	const MB = 1024 * 1024;
	const NOTIFICATION_DURATION = 3000;
	const TOTAL_IMG_VIDEO_SIZE_MB = 30;

	const categoryItems = data.categories.map((category) => ({
		value: category.category_id,
		name: category.name
	}));
	$: category = data.product.category_id;
	$: multipleFiles = data.medias;
	let checkboxValue = data.product?.active ?? false;
	let showcaseValue = data.product?.showcase ?? false;
	let featureValue = data.product?.feature ?? false;
	let showDiscountValue = data.product?.show_discount ?? false;
	const dataInput = {
		base_url: data.base_url,
		product_id: data.product.product_id,
		token: data.token
	};

	const { form, constraints, errors, enhance } = superForm(data.form, {
		applyAction: false,
		onSubmit: ({ formData }) => {
			loading = true;

			formData.set('product_id', data.product.product_id ?? 0);
			formData.set('content', content ?? data.product.content.content);
			formData.set('composition', composition ?? data.product.composition);
			formData.set('howToUse', howToUse ?? data.product.how_to_use);
			formData.set('category', category);
			formData.set('active', checkboxValue.toString());

			if (selectedFiles && selectedFiles.length > 0) {
				let totalFileSize = 0;
				let validFiles = true;

				Array.from(selectedFiles).forEach((file) => {
					const fileType = file.type;
					const fileSizeInMB = file.size / MB;

					if (fileType.startsWith('image/')) {
						if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
							notifications.danger(
								`Imagem "${file.name}" é maior que o tamanho permitido (${MAX_IMAGE_SIZE_MB} MB)!`,
								NOTIFICATION_DURATION
							);
							validFiles = false;
						} else {
							formData.append('images[]', file);
						}
					} else if (fileType.startsWith('video/')) {
						if (fileSizeInMB > MAX_VIDEO_SIZE_MB) {
							notifications.danger(
								`Vídeo "${file.name}" é maior que o tamanho permitido (${MAX_VIDEO_SIZE_MB} MB)!`,
								NOTIFICATION_DURATION
							);
							validFiles = false;
						} else {
							formData.append('images[]', file);
						}
					} else {
						notifications.danger(
							`O arquivo "${file.name}" não é uma imagem nem um vídeo válido.`,
							NOTIFICATION_DURATION
						);
						validFiles = false;
					}

					totalFileSize += file.size;
				});
				if (!validFiles) {
					notifications.danger(
						'Alguns arquivos não são válidos. Apenas imagens e vídeos são permitidos.',
						3000
					);
					loading = false;
					return;
				}
				const totalFileSizeInMB = totalFileSize / MB;
				if (totalFileSizeInMB > TOTAL_IMG_VIDEO_SIZE_MB) {
					notifications.danger(
						'O tamanho total das imagens/vídeos excede o limite permitido!',
						NOTIFICATION_DURATION
					);
					loading = false;
					return;
				}
			}
			if (files && files.length > 0) {
				const fileSizeInBytes = files[0].size;
				const fileSizeInMB = fileSizeInBytes / MB;
				const fileType = files[0].type;
				if (fileType.startsWith('image/')) {
					if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
						notifications.danger(
							'Imagem é maior que o tamanho permitido (250 MB)!',
							NOTIFICATION_DURATION
						);
						loading = false;
					} else {
						formData.set('image', files[0]);
					}
				} else if (fileType.startsWith('video/')) {
					if (fileSizeInMB < MAX_VIDEO_SIZE_MB) {
						notifications.danger(
							'Vídeo é menor que o tamanho permitido (300 MB)!',
							NOTIFICATION_DURATION
						);
						loading = false;
					} else {
						formData.set('image', files[0]);
						loading = false;
					}
				} else {
					notifications.danger(
						'Arquivo não é válido. Somente imagens ou vídeos são permitidos.',
						NOTIFICATION_DURATION
					);
					loading = false;
				}
			}
		},
		async onResult({ result }) {
			console.log(result);
			if (result.type === 'success') {
				selectedFiles = [];
				notifications.success('Produto atualizado com sucesso!', NOTIFICATION_DURATION);
				await goto(window.location.href, { invalidateAll: true });
			}
		}
	});

	function handleChangeContent(event: CustomEvent<{ value: string }>) {
		content = event.detail.value;
	}

	function handleChangeComposition(event: CustomEvent<{ value: string }>) {
		composition = event.detail.value;
	}

	function handleChangeHowToUse(event: CustomEvent<{ value: string }>) {
		howToUse = event.detail.value;
	}

	function remove_image_path() {
		data.product.image_path = null;
	}
</script>

<Toast />
<div class="w-[90vw] mt-8 mx-auto mb-8">
	<h1>{$_('ProductsMorePage.MoreActions')}</h1>
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">{$_('ProductsMorePage.CreateNewProduct')}</h1>
		<Button variant="secondary" on:click={() => goto('/admin/products')}
			>{$_('ProductsMorePage.Back')}</Button
		>
	</div>
	<h1 class="text-3xl font-semibold">{$_('ProductsMorePage.UpdateProduct')}</h1>
	<form class="mt-12 divide-y-2 divide-gray-400" method="POST" use:enhance>
		<div class="grid grid-cols-1 gap-1">
			<Input
				label="ID do Produto"
				name="product_id"
				type="text"
				disabled
				bind:value={data.product.product_id}
				{...$constraints.product_id}
			/>
			<div>
				<div class="grid grid-cols-2 gap-4">
					<Input
						label="Nome"
						name="name"
						type="text"
						bind:value={data.product.name}
						{...$constraints.name}
					/>
					<div>
						<Label class="mb-2">{$_('ProductsMorePage.Category')}</Label>
						<Select class="mt-2" id="category" bind:value={category}>
							{#each categoryItems as { value, name }}
								<option {value}>{name}</option>
							{/each}
						</Select>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<InputCurrency
						label="Preço"
						name="price"
						currency="BRL"
						on
						locale="pt-BR"
						bind:value={data.product.price}
						error={$errors.price}
						{...$constraints.price}
					/>
					<Input label="SKU" name="sku" bind:value={data.product.sku} {...$constraints.sku} />
				</div>
				{#if data.product.image_path}
					<div class="grid grid-cols-1 justify-center justify-items-center">
						<img src={data.product.image_path} width="500" height="600" />
						<div class="mt-8 w-80">
							<Button on:click={remove_image_path}>{$_('ProductsMorePage.Remove')}</Button>
						</div>
					</div>
				{/if}
				<div class="divide-y-2 divide-gray-400">
					<InputFile label="Imagem Principal" bind:files id="avatar" name="avatar" />
				</div>

				<div class="divide-y-2 divide-gray-400">
					<InputMultipleFile
						label="Arquivos Secundários"
						bind:multipleFiles
						bind:selectedFiles
						id="avatar"
						name="avatar"
						{dataInput}
					/>
				</div>
				<div class="grid grid-cols-4 gap-1">
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">{$_('ProductsMorePage.ProductStatus')}:</h2>
						<Checkbox bind:checked={checkboxValue}>{$_('ProductsMorePage.Active')}</Checkbox>
					</div>
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">{$_('ProductsMorePage.ShowInCarousel')}:</h2>
						<Checkbox bind:checked={showcaseValue}>{$_('ProductsMorePage.Active')}</Checkbox>
					</div>
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">{$_('ProductsMorePage.ShowInHighlight')}:</h2>
						<Checkbox bind:checked={featureValue}>{$_('ProductsMorePage.Active')}</Checkbox>
					</div>
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">{$_('ProductsMorePage.ShowInDiscount')}:</h2>
						<Checkbox bind:checked={showDiscountValue}>{$_('ProductsMorePage.Active')}</Checkbox>
					</div>
				</div>
				<h2 class="text-xl font-bold mt-4">{$_('ProductsMorePage.ProductDescription')}:</h2>
				<div class="my-10">
					<Editor
						label="Conteúdo"
						placeholder="Descrição..."
						bind:value={data.product.description.content}
						on:change={handleChangeContent}
					/>
				</div>
				<div class="my-10">
					<Editor
						label="Modo de uso"
						placeholder="Modo de uso..."
						bind:value={data.product.description.how_to_use}
						on:change={handleChangeHowToUse}
					/>
				</div>
				<div class="my-10">
					<Editor
						label="Composição"
						placeholder="Composição..."
						bind:value={data.product.description.composition}
						on:change={handleChangeComposition}
					/>
				</div>
				<h2 class="text-xl font-bold">{$_('ProductsMorePage.ProductDimensions')}:</h2>
				<div class="grid grid-cols-2 gap-4 mt-8">
					<Input
						label="Altura (cm)"
						type="number"
						defaultValue="0"
						name="height"
						bind:value={data.product.height}
						{...$constraints.height}
					/>
					<Input
						label="Comprimento (cm)"
						type="number"
						defaultValue="0"
						name="length"
						bind:value={data.product.length}
						{...$constraints.length}
					/>
					<Input
						label="Largura (cm)"
						type="number"
						defaultValue="0"
						name="width"
						bind:value={data.product.width}
						{...$constraints.width}
					/>
					<Input
						label="Diametro (cm)"
						type="number"
						defaultValue="0"
						name="width"
						bind:value={data.product.width}
						{...$constraints.diameter}
					/>
					<Input
						label="Peso (gramas)"
						type="number"
						defaultValue="0"
						name="weight"
						bind:value={data.product.weight}
						{...$constraints.weight}
					/>
				</div>
				<div class="inline-flex w-full justify-center">
					<div class="mt-8 w-80">
						<Button block {loading} type="submit">{$_('ProductsMorePage.Save')}</Button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
