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
	import InputFileMultiple from '$lib/components/InputFileMultiple.svelte';

	export let data;
	let loading = false;
	let content = '';
	let composition = '';
	let howToUse = '';
	let files: FileList;
	let multipleFiles: FileList;

	const categoryItems = data.categories.map((category) => ({
		value: category.category_id,
		name: category.name
	}));
	$: category = data.product.category_id;
	let checkboxValue = data.product?.active ?? false;
	let showcaseValue = data.product?.showcase ?? false;
	let featureValue = data.product?.feature ?? false;
	let showDiscountValue = data.product?.show_discount ?? false;

	const { form, constraints, errors, enhance } = superForm(data.form, {
		applyAction: false,
		onSubmit: ({ formData }) => {
			loading = true;
			console.log(category);
			console.log(formData);
			formData.set('product_id', data.product.product_id ?? 0);
			formData.set('content', content ?? data.product.content.content);
			formData.set('composition', composition ?? data.product.composition);
			formData.set('howToUse', howToUse ?? data.product.how_to_use);
			formData.set('category', category);
			formData.set('active', checkboxValue.toString());
			if (files && files.length > 0) {
				formData.set('image', files[0]);
				const fileSizeInBytes = files[0].size;
				const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
				if (fileSizeInMB > 2) {
					notifications.danger('Imagem é maior que o permitido!', 3000);
				}
			}
		},
		onResult({ result }) {
			loading = false;
			console.log(result.type === 'success');
			if (result.type === 'success') {
				notifications.success('Produto atualizado com sucesso!', 3000);
				goto('/admin/products');
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
	<h1>Mais ações</h1>
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Criar Novo Produto</h1>
		<Button variant="secondary" on:click={() => goto('/admin/products')}>Voltar</Button>
	</div>
	<h1 class="text-3xl font-semibold">Atualizar Produto</h1>
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
						<Label class="mb-2">Categoria</Label>
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
							<Button on:click={remove_image_path}>Remover</Button>
						</div>
					</div>
				{/if}
				<div class="divide-y-2 divide-gray-400">
					<InputFile label="Imagem Principal" bind:files id="avatar" name="avatar" />
				</div>

				<div class="divide-y-2 divide-gray-400">
					<InputFileMultiple
						label="Arquivos Secundários"
						bind:multipleFiles
						id="avatar"
						name="avatar"
					/>
				</div>
				<div class="grid grid-cols-4 gap-1">
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">Status do produto:</h2>
						<Checkbox bind:checked={checkboxValue}>Ativo</Checkbox>
					</div>
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">Exibir no carrossel:</h2>
						<Checkbox bind:checked={showcaseValue}>Ativo</Checkbox>
					</div>
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">Exibir no destaque:</h2>
						<Checkbox bind:checked={featureValue}>Ativo</Checkbox>
					</div>
					<div class="grid grid-cols-1 gap-1">
						<h2 class="text-xl font-bold mt-4 mb-4">Exibir no desconto:</h2>
						<Checkbox bind:checked={showDiscountValue}>Ativo</Checkbox>
					</div>
				</div>
				<h2 class="text-xl font-bold mt-4">Descrição do produto:</h2>
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
				<h2 class="text-xl font-bold">Dimensões do produto:</h2>
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
						<Button block {loading} type="submit">Salvar</Button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
