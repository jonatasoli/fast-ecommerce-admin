<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
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

	let rowsPerPage = data.offset ?? 10;
	let currentPage = data.page ?? 1;
	const searchParams = new URLSearchParams($page.url.searchParams);

	$: items = data.products ?? [];
	console.log(data.products);
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.totalRecords);
	$: endPage = data.totalPages;

	$: if (currentPage > endPage) {
		currentPage = endPage;
	}

	async function handleRowsPerPageChange(event) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page
		searchParams.set('offset', `${rowsPerPage}`);
		searchParams.set('page', `${currentPage}`);
		goto(`/admin/products?page=${currentPage}&offset=${rowsPerPage}`);
	}

	function firstPage() {
		currentPage = 1;
		goto(`/admin/products?page=${currentPage}&offset=${rowsPerPage}`);
	}

	function nextPage() {
		console.log(currentPage);
		if (currentPage < endPage) {
			currentPage++;
			console.log(currentPage);
			goto(`/admin/products?page=${currentPage}&offset=${rowsPerPage}`);
		}
	}

	function prevPage() {
		console.log(currentPage);
		if (currentPage > 1) {
			currentPage--;
			console.log(currentPage);
			goto(`/admin/products?page=${currentPage}&offset=${rowsPerPage}`);
		}
	}

	function lastPage() {
		currentPage = data.totalPages;
		goto(`/admin/products?page=${currentPage}&offset=${rowsPerPage}`);
	}

	function goToNew() {
		goto('/admin/products/new');
	}

	function productMore(product_id: number) {
		goto(`/admin/products/more?product_id=${product_id}`);
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">{$_('products.title')}</h1>
		<Button variant="primary" on:click={goToNew}>{$_('products.newProduct')}</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell class="pl-0 ">{$_('products.table.id')}</TableHeadCell>
				<TableHeadCell class="pl-0 ">{$_('products.table.product')}</TableHeadCell>
				<TableHeadCell class="pl-0 ">{$_('products.table.inventory')}</TableHeadCell>
				<TableHeadCell class="pl-0 ">{$_('products.table.price')}</TableHeadCell>
				<TableHeadCell>{$_('products.table.actions')}</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each items as product}
					<TableBodyRow>
						<TableBodyCell tdClass="py-2">{product.product_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{product.name}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{product.quantity}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{currencyFormat(product.price)}</TableBodyCell>
						<TableBodyCell tdClass="py-2">
							<Button variant="primary" on:click={() => productMore(product.product_id)}
								>{$_('products.more')}</Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="w-full flex justify-end items-center gap-2 my-3">
			<Label>{$_('tables.quantityPerPage')}</Label>
			<Select
				variant="outlined"
				bind:value={rowsPerPage}
				noLabel
				class="w-24"
				placeholder={$_('tables.placeholderChoice')}
				items={[
					{ value: 10, name: '10' },
					{ value: 20, name: '20' },
					{ value: 50, name: '50' },
					{ value: 100, name: '100' }
				]}
				on:change={handleRowsPerPageChange}
			/>

			{start + 1}-{end} de {data.totalRecords}

			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === 1}
				on:click={firstPage}
			>
				<ChevronDoubleLeftOutline class="w-7 h-7 outline-none" />
			</button>
			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === 1}
				on:click={prevPage}
			>
				<AngleLeftOutline class="w-5 h-5 outline-none" />
			</button>
			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === endPage}
				on:click={nextPage}
			>
				<AngleRightOutline class="w-5 h-5 outline-none" />
			</button>
			<button
				class="cursor-pointer disabled:pointer-events-none disabled:text-gray-400"
				disabled={currentPage === endPage}
				on:click={lastPage}
			>
				<ChevronDoubleRightOutline class="w-7 h-7 outline-none" />
			</button>
		</div>
	</div>
</div>
