<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { currencyFormat } from '$lib/utils.js';
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

	let rowsPerPage = 10;
	let currentPage = 1;

	$: items = data.products;
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.totalRecords);
	$: endPage = data.totalPages;

	$: if (currentPage > endPage) {
		currentPage = endPage;
	}

	function firstPage() {
		currentPage = 1;
		goto(`/admin/products?page=${currentPage}`);
	}

	function nextPage() {
		if (currentPage < endPage) {
			currentPage++;
			goto(`/admin/products?page=${currentPage}`);
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			goto(`/admin/products?page=${currentPage}`);
		}
	}

	function lastPage() {
		currentPage = data.totalPages;
		goto(`/admin/products?page=${currentPage}`);
	}

	function goToNew() {
		goto('/admin/products/new');
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Produtos</h1>
		<Button variant="primary" on:click={goToNew}>Novo Produto</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Id</TableHeadCell>
				<TableHeadCell>Produto</TableHeadCell>
				<TableHeadCell>Estoque</TableHeadCell>
				<TableHeadCell>Preço</TableHeadCell>
				<TableHeadCell>Ações</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each items as product}
					<TableBodyRow>
						<TableBodyCell tdClass="py-2">{product.product_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{product.name}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{product.quantity}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{currencyFormat(product.price)}</TableBodyCell>
						<TableBodyCell tdClass="py-2">
							<Button variant="primary">Ver mais</Button>
						</TableBodyCell>
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
			/>

			{start + 1}-{end} de {data.totalRecords}

			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === 1}
			>
				<ChevronDoubleLeftOutline class="w-7 h-7 outline-none" on:click={firstPage} />
			</button>
			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === 1}
			>
				<AngleLeftOutline class="w-5 h-5 outline-none" on:click={prevPage} />
			</button>
			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === endPage}
			>
				<AngleRightOutline class="w-5 h-5 outline-none" on:click={nextPage} />
			</button>
			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === endPage}
			>
				<ChevronDoubleRightOutline class="w-7 h-7 outline-none" on:click={lastPage} />
			</button>
		</div>
	</div>
</div>
