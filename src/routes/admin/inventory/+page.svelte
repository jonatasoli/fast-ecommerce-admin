<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createInventory } from '$lib/stores/inventory';
	import {
		Label,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';

	export let data;

	const inventoryStore = createInventory();
	inventoryStore.set({
		inventory: data.inventory.inventory,
		page: data.inventory.page,
		offset: data.inventory.offset,
		totalPages: data.inventory.total_pages,
		totalRecords: data.inventory.total_records
	});

	let rowsPerPage = data.inventory.offset;
	let currentPage = data.inventory.page;
	const searchParams = new URLSearchParams($page.url.searchParams);

	$: items = data.inventory.inventory;
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.inventory.total_records);
	$: endPage = data.inventory.total_pages;
	$: if (currentPage > endPage) {
		currentPage = endPage;
	}
	inventoryStore.subscribe(($store) => {
		items = $store.inventory;
		rowsPerPage = $store.offset;
		currentPage = $store.page;
		start = currentPage * rowsPerPage - rowsPerPage;
		end = Math.min(start + rowsPerPage, $store.totalRecords);
		endPage = $store.totalPages;
	});
	onMount(() => {
		refreshInventory();
	});

	async function refreshInventory() {
		await inventoryStore.get(
			`${data.base_url}/product/inventory?page=${currentPage}&offset=${rowsPerPage}`,
			data.access_token
		);
	}

	async function handleRowsPerPageChange(event) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page
		searchParams.set('offset', rowsPerPage);
		searchParams.set('page', currentPage);
		await refreshInventory();
	}

	function firstPage() {
		currentPage = 1;
		searchParams.set('page', currentPage);
		refreshInventory();
	}

	async function nextPage() {
		if (currentPage < endPage) {
			console.log(currentPage);
			currentPage++;
			searchParams.set('page', currentPage);
			await refreshInventory();
			console.log(searchParams.get('page'));
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			searchParams.set('page', currentPage);
			console.log(currentPage);
			refreshInventory();
		}
	}

	function lastPage() {
		currentPage = data.inventory.total_pages;
		searchParams.set('page', currentPage);
		refreshInventory();
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Estoque</h1>
		<Button variant="primary" on:click={() => goto('inventory/new')}>Atualizar estoque</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Id</TableHeadCell>
				<TableHeadCell>Produto</TableHeadCell>
				<TableHeadCell>Quantidade</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each items as inventory}
					<TableBodyRow>
						<TableBodyCell tdClass="py-2">{inventory.product_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{inventory.name}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{inventory.quantity}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		<div class="w-full flex justify-end items-center gap-2 my-3">
			<Label>Quantidade por página</Label>
			<Select
				variant="outlined"
				bind:value={rowsPerPage}
				noLabel
				class="w-24"
				placeholder="Escolha uma opção"
				items={[
					{ value: 10, name: '10' },
					{ value: 20, name: '20' },
					{ value: 50, name: '50' },
					{ value: 100, name: '100' }
				]}
				on:change={handleRowsPerPageChange}
			/>

			{start + 1}-{end} de {data.inventory.total_records}

			<button
				on:click={firstPage}
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === 1}
			>
				<ChevronDoubleLeftOutline class="w-7 h-7 outline-none" />
			</button>
			<button
				on:click={prevPage}
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === 1}
			>
				<AngleLeftOutline class="w-5 h-5 outline-none" />
			</button>
			<button
				on:click={async () => await nextPage()}
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === endPage}
			>
				<AngleRightOutline class="w-5 h-5 outline-none" />
			</button>
			<button
				on:click={lastPage}
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === endPage}
			>
				<ChevronDoubleRightOutline class="w-7 h-7 outline-none" />
			</button>
		</div>
	</div>
</div>
