<script lang="ts">
	import { onMount } from 'svelte';
	import { productsStore } from '$lib/stores/product';
	import { goto, invalidate } from '$app/navigation';
	import { NumberInput, Toast, Select, Button, Input } from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import type { ActionData } from '../$types';
	import { _ } from 'svelte-i18n';
	type Transaction = {
		product_id: number | undefined;
		quantity: number;
		operation: 'INCREASE' | 'DECREASE';
	};

	export let data: any;
	let transaction: Transaction = {
		product_id: undefined,
		quantity: 1,
		operation: 'INCREASE'
	};
	let notification = false;
	$: products = data.products.inventory ?? [];

	onMount(() => {});
	export let form: ActionData;

	function getProductQuantityByTransaction(transaction: number | undefined) {
		const product = products.find((p: any) => p.product_id === transaction);
		return product ? product.quantity : 0;
	}

	async function createOperation(event: Event) {
		try {
			const formData = new FormData();
			formData.append('product_id', String(transaction.product_id));
			formData.append('operation', transaction.operation);

			const quantity =
				transaction.operation === 'INCREASE'
					? Math.abs(transaction.quantity)
					: -Math.abs(transaction.quantity);

			formData.append('quantity', String(quantity));

			const response = await fetch('new', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();
			console.log(result);

			if (response.ok) {
				invalidate('/admin/inventory/new');
				notification = true;
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} else {
				console.error(`Erro na sua solicitação: ${response.statusText}`);
			}
		} catch (error) {
			console.error('Erro ao criar operação:', error);
			alert('Erro ao criar operação.');
		} finally {
			notification = false;
		}
	}
</script>

<div class="w-[50vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">{$_('NewInventoryPage.CreateTransaction')}</h1>
		<Button variant="secondary" on:click={() => goto('/admin/inventory')}
			>{$_('NewInventoryPage.Back')}</Button
		>
	</div>

	<div class="w-full mx-auto mt-12">
		{#if notification}
			<Toast color="green">
				<svelte:fragment slot="icon">
					<CheckCircleSolid class="w-5 h-5" />
					<span class="sr-only">{$_('NewInventoryPage.CheckIcon')}</span>
				</svelte:fragment>
				{$_('NewInventoryPage.TransactionCreatedSuccessfully')}
			</Toast>
		{/if}
		{#if form}
			<p>{$_('NewInventoryPage.TransactionPerformed')}</p>
		{/if}
		<form class="flex flex-col gap-4" method="POST" on:submit|preventDefault={createOperation}>
			<label for="product">{$_('NewInventoryPage.Product')}</label>
			<Select class="mt-2" id="product" bind:value={transaction.product_id}>
				{#each products as { product_id, name }}
					<option value={product_id}>{name}</option>
				{/each}
			</Select>

			<label for="quantity">{$_('NewInventoryPage.CurrentStock')}</label>
			<Input
				id="quantity"
				type="text"
				value={getProductQuantityByTransaction(transaction.product_id)}
				readonly
				class="mt-1 w-full"
			/>

			<label for="quantity">{$_('NewInventoryPage.Quantity')}</label>
			<NumberInput id="quantity" bind:value={transaction.quantity} min="1" />
			<Select class="mt-2" id="operation" bind:value={transaction.operation}>
				<option value="INCREASE">{$_('NewInventoryPage.ADD')}</option>
				<option value="DECREASE">{$_('NewInventoryPage.REMOVE')}</option>
			</Select>
			<Button variant="primary" type="submit">{$_('NewInventoryPage.CreateOperation')}</Button>
			<div class="my-8"></div>
		</form>
	</div>
</div>
