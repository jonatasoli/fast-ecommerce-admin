<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ordersStore } from '$lib/stores/sales';
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

	let rowsPerPage = data.orders.offset;
	let currentPage = data.orders.page;
	const searchParams = new URLSearchParams($page.url.searchParams);

	$: items = data.orders.orders;
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.orders.total_records);
	$: endPage = data.orders.total_pages;
	$: if (currentPage > endPage) {
		currentPage = endPage;
	}

	ordersStore.subscribe(($store) => {
		items = $store.orders;
		rowsPerPage = $store.offset;
		currentPage = $store.page;
		start = currentPage * rowsPerPage - rowsPerPage;
		end = Math.min(start + rowsPerPage, $store.totalRecords);
		endPage = $store.totalPages;
	});
	onMount(() => {
		refreshOrders();
	});

	async function refreshOrders() {
		if (data?.orders) {
			await ordersStore.get(
				`${data.base_url}/order/orders/?page=${currentPage}&offset=${rowsPerPage}`,
				data.orders.access_token
			);
		} else {
			console.error('Missing data or access token');
		}
	}

	async function handleRowsPerPageChange(event) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page
		searchParams.set('offset', rowsPerPage);
		searchParams.set('page', currentPage);
		await refreshOrders();
	}

	function firstPage() {
		currentPage = 1;
		searchParams.set('page', currentPage);
		refreshOrders();
	}

	async function nextPage() {
		if (currentPage < endPage) {
			console.log(currentPage);
			currentPage++;
			searchParams.set('page', currentPage);
			await refreshOrders();
			console.log(searchParams.get('page'));
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			searchParams.set('page', currentPage);
			console.log(currentPage);
			refreshOrders();
		}
	}

	function lastPage() {
		currentPage = data.orders.total_pages;
		searchParams.set('page', currentPage);
		refreshOrders();
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Pedidos</h1>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Id</TableHeadCell>
				<TableHeadCell>ID Affiliado</TableHeadCell>
				<TableHeadCell>Data</TableHeadCell>
				<TableHeadCell>Desconto</TableHeadCell>
				<TableHeadCell>Rastreio</TableHeadCell>
				<TableHeadCell>Status do pedido</TableHeadCell>
				<TableHeadCell>ID do comprador</TableHeadCell>
				<TableHeadCell>Nome do comprador</TableHeadCell>
				<TableHeadCell>Email do comprador</TableHeadCell>
				<TableHeadCell>Tipo de frete</TableHeadCell>
				<TableHeadCell>ID do Cupom</TableHeadCell>
				<TableHeadCell>Motivo do cancelamento</TableHeadCell>
				<TableHeadCell>Data do cancelamento</TableHeadCell>
				<TableHeadCell>Editar</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each items as order}
					<TableBodyRow>
						<TableBodyCell tdClass="py-2">{order.order_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.affiliate_id ?? ''}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.order_date}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.discount}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.tracking_number ?? 'não enviado'}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.order_status}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.user.user_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.user.name}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.user.email}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.freight}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.coupon_id ?? 'sem cupom'}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.cancelled_reason ?? ''}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.cancelled_at ?? ''}</TableBodyCell>
						<TableBodyCell tdClass="py-2"
							><Button
								variant="primary"
								on:click={() => {
									goto(`sales/new?order_id=${order.order_id}`);
								}}>Editar</Button
							></TableBodyCell
						>
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

			{start + 1}-{end} de {data.orders.total_records}

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
