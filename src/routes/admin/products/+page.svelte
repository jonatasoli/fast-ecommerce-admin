<script lang="ts">
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
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';
	import { productsStore } from '$lib/stores/product';
	
	export let data: any;
	let debounceTimeout: ReturnType<typeof setTimeout>;
	let searchTerm = '';
	let rowsPerPage = data.offset ?? 10;
	let currentPage = data.page ?? 1;
	const searchParams = new URLSearchParams($page.url.searchParams);
	const products = productsStore();
	products.set({
		inventory: data.products.inventory,
		page: data.products.page,
		offset: data.products.offset,
		total_pages: data.products.total_pages,
		total_records: data.products.total_records
	});

	$: items = data.products.inventory ?? [];
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.products.total_records);
	$: endPage = data.products.total_pages;
	$: searchTerm, debounceSearch(searchTerm);

	$: if (currentPage > endPage) {
		currentPage = endPage;
	}

	products.subscribe(($store) => {
		items = $store.inventory;
		rowsPerPage = $store.offset;
		currentPage = $store.page;
		start = currentPage * rowsPerPage - rowsPerPage;
		end = Math.min(start + rowsPerPage, $store.total_records);
		endPage = $store.total_pages;
	});

	async function getProductsByFilter(query: string) {
		await products.get(`${data.base_url}/product/products/${query}`, data.access_token);
	}

	async function refreshProducts() {
		await products.get(
			`${data.base_url}/product/inventory?offset=${rowsPerPage}&page=${currentPage}`,
			data.access_token
		);
	}

	function debounceSearch(query: string) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			if (searchTerm.length > 3) {
				getProductsByFilter(query);
			} else {
				currentPage = 1;
				rowsPerPage = 10;
				refreshProducts();
			}
		}, 300);
	}

	async function handleRowsPerPageChange(event: any) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page
		searchParams.set('offset', `${rowsPerPage}`);
		searchParams.set('page', `${currentPage}`);
		await refreshProducts();
	}

	async function firstPage() {
		currentPage = 1;
		await refreshProducts();
	}

	async function nextPage() {
		if (currentPage < endPage) {
			currentPage++;
			await refreshProducts();
		}
	}

	async function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			await refreshProducts();
		}
	}

	async function lastPage() {
		currentPage = endPage;
		await refreshProducts();
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
		<h1 class="text-3xl font-semibold">Produtos</h1>
		<Button variant="primary" on:click={goToNew}>Novo Produto</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableSearch
				innerDivClass="p-0 my-2"
				placeholder="Buscar por nome ou documento"
				hoverable={true}
				bind:inputValue={searchTerm}
			>
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
								<Button variant="primary" on:click={() => productMore(product.product_id)}
									>Ver mais</Button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</TableSearch>
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

			{start + 1}-{end} de {data.products.total_records}

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
