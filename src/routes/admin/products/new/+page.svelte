<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import Input from '$lib/components/Input.svelte';
	import InputCurrency from '$lib/components/InputCurrency.svelte';
	import InputFile from '$lib/components/InputFile.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { notifications } from '$lib/notifications.js';
	import { superForm } from 'sveltekit-superforms';
	import { Label, Select } from 'flowbite-svelte';

	export let data;
	let loading = false;
	let content = '';
	let composition = '';
	let howToUse = '';
	let files: FileList;

	const categoryItems = data.categories.map((category) => ({
		value: category.category_id,
		name: category.name
	}));
	$: category = '';

	const { form, constraints, errors, enhance } = superForm(data.form, {
		applyAction: false,
		onSubmit: ({ formData }) => {
			loading = true;
			console.log(formData);
			formData.set('content', content);
			formData.set('composition', composition);
			formData.set('howToUse', howToUse);
			formData.set('category', category);
			if (files && files.length > 0) {
				formData.set('image', files[0]);
			}
		},
		onResult({ result }) {
			loading = false;
			console.log(result.type === 'success');
			if (result.type === 'success') {
				notifications.success('Produto Criado com sucesso!', 3000);
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
</script>

<div class="w-[90vw] mt-8 mx-auto mb-8">
	<Toast />
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Criar Novo Produto</h1>
		<Button variant="secondary" on:click={() => goto('/admin/products')}>Voltar</Button>
	</div>
	<h1 class="text-3xl font-semibold">Novo Produto</h1>
	<form class="mt-12" method="POST" use:enhance>
		<div class="grid grid-cols-2 gap-4">
			<Input label="Nome" name="name" type="text" bind:value={$form.name} {...$constraints.name} />
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
				bind:value={$form.price}
				error={$errors.price}
				{...$constraints.price}
			/>
			<Input label="SKU" name="sku" bind:value={$form.sku} {...$constraints.sku} />
		</div>
		<div>
			<InputFile label="Imagem" bind:files id="avatar" name="avatar" />
		</div>
		<h2 class="text-xl font-bold mt-4">Descrição do produto:</h2>
		<div class="my-10">
			<Editor label="Conteúdo" placeholder="Descrição..." on:change={handleChangeContent} />
		</div>
		<div class="my-10">
			<Editor label="Modo de uso" placeholder="Modo de uso..." on:change={handleChangeHowToUse} />
		</div>
		<div class="my-10">
			<Editor label="Composição" placeholder="Composição..." on:change={handleChangeComposition} />
		</div>
		<h2 class="text-xl font-bold">Dimensões do produto:</h2>
		<div class="grid grid-cols-2 gap-4 mt-8">
			<Input
				label="Altura (cm)"
				type="number"
				defaultValue="0"
				name="height"
				bind:value={$form.height}
				{...$constraints.height}
			/>
			<Input
				label="Comprimento (cm)"
				type="number"
				defaultValue="0"
				name="length"
				bind:value={$form.length}
				{...$constraints.length}
			/>
			<Input
				label="Largura (cm)"
				type="number"
				defaultValue="0"
				name="width"
				bind:value={$form.width}
				{...$constraints.width}
			/>
			<Input
				label="Diametro (cm)"
				type="number"
				defaultValue="0"
				name="width"
				bind:value={$form.diameter}
				{...$constraints.diameter}
			/>
			<Input
				label="Peso (gramas)"
				type="number"
				defaultValue="0"
				name="weight"
				bind:value={$form.weight}
				{...$constraints.weight}
			/>
		</div>
		<div class="inline-flex w-full justify-center">
			<div class="mt-8 w-80">
				<Button block {loading} type="submit">Salvar</Button>
			</div>
		</div>
	</form>
</div>
