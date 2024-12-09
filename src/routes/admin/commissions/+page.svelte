<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { commissionsStore } from '$lib/stores/commissions';
	import {
		Label,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Badge,
		Popover
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';
	import { currencyFormat } from '$lib/utils.js';

	export let data;
	let searchTerm = '';

	console.log(data);

	const commission = commissionsStore();
	commission.set({
		commissions: data.commissions.commissions,
		page: data.commissions.page,
		offset: data.commissions.offset,
		totalPages: data.commissions.total_pages,
		totalRecords: data.commissions.total_records
	});

	let rowsPerPage = data.commissions.offset;
	let currentPage = data.commissions.page;
	// const searchParams = new URLSearchParams($page.url.searchParams);

	$: items = data.commissions.commissions;
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.commissions.total_records);
	$: endPage = data.commissions.total_pages;
	$: if (currentPage > endPage) {
		currentPage = endPage;
	}
	// commission.subscribe(($store) => {
	// 	commissions = $store.commissions;
	// 	rowsPerPage = $store.offset;
	// 	currentPage = $store.page;
	// 	start = currentPage * rowsPerPage - rowsPerPage;
	// 	end = Math.min(start + rowsPerPage, $store.totalRecords);
	// 	endPage = $store.totalPages;
	// });
	// // onMount(() => {
	// // 	refreshInventory();
	// // });

	// // async function refreshInventory() {
	// // 	await commission.get(
	// // 		`${data.base_url}/product/inventory?page=${currentPage}&offset=${rowsPerPage}`,
	// // 		data.commissions.access_token
	// // 	);
	// // }

	// async function handleRowsPerPageChange(event) {
	// 	rowsPerPage = parseInt(event.target.value);
	// 	currentPage = 1; // Reset to first page
	// 	searchParams.set('offset', rowsPerPage);
	// 	searchParams.set('page', currentPage);
	// 	await refreshInventory();
	// }

	// function firstPage() {
	// 	currentPage = 1;
	// 	searchParams.set('page', currentPage);
	// 	refreshInventory();
	// }

	// async function nextPage() {
	// 	if (currentPage < endPage) {
	// 		console.log(currentPage);
	// 		currentPage++;
	// 		searchParams.set('page', currentPage);
	// 		await refreshInventory();
	// 		console.log(searchParams.get('page'));
	// 	}
	// }

	// function prevPage() {
	// 	if (currentPage > 1) {
	// 		currentPage--;
	// 		searchParams.set('page', currentPage);
	// 		console.log(currentPage);
	// 		refreshInventory();
	// 	}
	// }

	// function lastPage() {
	// 	currentPage = data.inventory.total_pages;
	// 	searchParams.set('page', currentPage);
	// 	refreshInventory();
	// }
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Gestão de Comissões</h1>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableSearch
				innerDivClass="p-0 my-2"
				placeholder="Buscar por cupom ou produto"
				hoverable={true}
				bind:inputValue={searchTerm}
			>
				<TableHead>
					<TableHeadCell class="pl-0 cursor-pointer">Order ID</TableHeadCell>
					<TableHeadCell class="pl-0 cursor-pointer">Usuário</TableHeadCell>
					<TableHeadCell class="pl-0 cursor-pointer">comissão</TableHeadCell>
					<TableHeadCell class="pl-0 cursor-pointer" o>Pagamento</TableHeadCell>

					<TableHeadCell class="pl-0 cursor-pointer">Status</TableHeadCell>

					<TableHeadCell class="cursor-pointer">ID Pagamento</TableHeadCell>

					<TableHeadCell class="">Ações</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each items as commission}
						<TableBodyRow>
							<TableBodyCell tdClass="py-2">{commission.order_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{commission.user.name}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{currencyFormat(commission.commission)}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{commission.paid}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{commission.active}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{commission.payment_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">
								<Button
									variant="primary"
									additionalClass="w-full sm:w-auto sm:text-base text-sm py-1 px-2 sm:py-2 sm:px-4"
									>Ações</Button
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

			{start + 1}-{end} de {endPage}

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
	<!-- <div class="flex justify-between items-center w-full">
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
	</div> -->
</div>
