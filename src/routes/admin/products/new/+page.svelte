<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import InputCurrency from '$lib/components/InputCurrency.svelte';
	import Select from '$lib/components/Select.svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, constraints, errors, enhance } = superForm(data.form, {
		applyAction: false,
		onResult({ result }) {
			console.log(result);
			if (result.type === 'success') {
				goto('/admin/products');
			}
		}
	});
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<h1 class="text-3xl font-semibold">Novo Produto</h1>

	<form class="mt-12" method="POST" use:enhance>
		<div class="grid grid-cols-2 gap-4">
			<Input label="Nome" name="name" type="text" bind:value={$form.name} {...$constraints.name} />
			<Select
				label="Categoria"
				name="category"
				bind:value={$form.category}
				{...$constraints.category}
			>
				{#each data.categories as category (category.category_id)}
					<option value={category.category_id}>{category.name}</option>
				{/each}
			</Select>
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
		<Input label="Descrição" bind:value={$form.description} {...$constraints.description} />
		<h2 class="text-xl font-bold">Dimensões do produto:</h2>
		<div class="grid grid-cols-2 gap-4 mt-8">
			<Input
				label="Altura"
				type="number"
				defaultValue="0"
				name="height"
				bind:value={$form.height}
				{...$constraints.height}
			/>
			<Input
				label="Largura"
				type="number"
				defaultValue="0"
				name="width"
				bind:value={$form.width}
				{...$constraints.width}
			/>
			<Input
				label="Comprimento"
				type="number"
				defaultValue="0"
				name="length"
				bind:value={$form.length}
				{...$constraints.length}
			/>
			<Input
				label="Peso"
				type="number"
				defaultValue="0"
				name="weight"
				bind:value={$form.weight}
				{...$constraints.weight}
			/>
		</div>
		<div class="inline-flex w-full justify-center">
			<div class="mt-8 w-80">
				<Button block>Salvar</Button>
			</div>
		</div>
	</form>
</div>
