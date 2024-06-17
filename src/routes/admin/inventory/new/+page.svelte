<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { NumberInput, Toast, Select, Button } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import type { ActionData } from '../$types';

	export let data;
	let transaction = {
		product_id: undefined,
		quantity: 1,
		operation: 'INCREASE'
	};
	let notification = false;
	$: products = data.products.products;
	// Carregar os dados do pedido
	onMount(() => {
		const params = new URLSearchParams($page.url.searchParams);
		console.log(params);
	});
	export let form: ActionData;

	async function createOperation(event: Event) {
		try {
			const formData = new FormData();
			formData.append('product_id', transaction.product_id);
			formData.append('quantity', transaction.quantity);
			formData.append('operation', transaction.operation);
			const response = await fetch('new', {
				method: 'POST',
				body: formData
			});
			console.log(response);
			const result = await response.json();
			console.log(result);

			if (response.ok) {
				// Operação criada com sucesso
				notification = true;
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} else {
				// Erro na criação da operação
				console.log(`Erro na sua solicitação ${response}`);
			}
		} catch (error) {
			console.error('Erro ao criar operação:', error);
			alert('Erro ao criar operação.');
		}
		notification = false;
	}
</script>

<div class="w-[50vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Criar transação</h1>
		<Button variant="secondary" on:click={() => goto('/admin/inventory')}>Voltar</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		{#if notification}
			<Toast color="green">
				<svelte:fragment slot="icon">
					<CheckCircleSolid class="w-5 h-5" />
					<span class="sr-only">Check icon</span>
				</svelte:fragment>
				Transação criada com sucesso!
			</Toast>
		{/if}
		{#if form}
			<p>Transação realizada</p>
		{/if}
		<form class="flex flex-col gap-4" method="POST" on:submit|preventDefault={createOperation}>
			<label for="product">Produto</label>
			<Select class="mt-2" id="product" bind:value={transaction.product_id}>
				{#each products as { product_id, name }}
					<option value={product_id}>{name}</option>
				{/each}
			</Select>

			<label for="quantity">Quantidade</label>
			<NumberInput id="quantity" bind:value={transaction.quantity} />
			<Select class="mt-2" id="operation" bind:value={transaction.operation}>
				<option value="INCREASE">ADICIONAR</option>
				<option value="DECREASE">REMOVER</option>
			</Select>
			<Button variant="primary" type="submit">Criar Operação</Button>
			<div class="my-8"></div>
		</form>
	</div>
</div>
