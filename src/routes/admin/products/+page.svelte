<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button';
	import { Label } from '@smui/common';
	import { goto } from '$app/navigation';
	import { currencyFormat } from '$lib/utils.js';

	export let data;

	let rowsPerPage = 10;
	let currentPage = 1;

	$: items = data.products;
	$: start = currentPage * rowsPerPage;
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
		<DataTable table$aria-label="Product list" class="w-full">
			<Head>
				<Row>
					<Cell class="font-bold">Id</Cell>
					<Cell class="font-bold">Produto</Cell>
					<Cell class="font-bold">Estoque</Cell>
					<Cell class="font-bold">Preço</Cell>
					<Cell class="font-bold">Ações</Cell>
				</Row>
			</Head>
			<Body>
				{#each items as product}
					<Row>
						<Cell>{product.product_id}</Cell>
						<Cell>{product.name}</Cell>
						<Cell>{product.quantity}</Cell>
						<Cell>{currencyFormat(product.price)}</Cell>
						<Cell>
							<Button variant="primary">Ver mais</Button>
						</Cell>
					</Row>
				{/each}
			</Body>

			<Pagination slot="paginate">
				<svelte:fragment slot="rowsPerPage">
					<Label>Quantidade por página</Label>
					<Select variant="outlined" bind:value={rowsPerPage} noLabel>
						<Option value={10}>10</Option>
						<Option value={25}>25</Option>
						<Option value={100}>100</Option>
					</Select>
				</svelte:fragment>
				<svelte:fragment slot="total">
					{start + 1}-{end} of {data.totalRecords}
				</svelte:fragment>

				<IconButton
					class="material-icons"
					action="first-page"
					title="First page"
					on:click={firstPage}
					disabled={currentPage === 1}>first_page</IconButton
				>
				<IconButton
					class="material-icons"
					action="prev-page"
					title="Prev page"
					on:click={prevPage}
					disabled={currentPage === 1}>chevron_left</IconButton
				>
				<IconButton
					class="material-icons"
					action="next-page"
					title="Next page"
					on:click={nextPage}
					disabled={currentPage === endPage}>chevron_right</IconButton
				>
				<IconButton
					class="material-icons"
					action="last-page"
					title="Last page"
					on:click={lastPage}
					disabled={currentPage === endPage}>last_page</IconButton
				>
			</Pagination>
		</DataTable>
	</div>
</div>
