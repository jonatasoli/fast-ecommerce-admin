<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
    
	import { currencyFormat, getStatusTranslation } from '$lib/utils.js';
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
	import LogisticsModal from '$lib/components/LogisticsModal.svelte';
	

	export let data;

	let rowsPerPage = data.offset ?? 10;
	let currentPage = data.page ?? 1;
	const searchParams = new URLSearchParams($page.url.searchParams);
    let trackingFilter = searchParams.get('tracking_number') === 'true' ? true : false;
    let isModalOpen = false;
  let selectedOrder = {
    order_id: 0,
    order_date: '',
    order_status: '',
    tracking_number: '',
    

  };

	$: items = data.orders ?? [];
	console.log(data.orders);
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.totalRecords);
	$: endPage = data.totalPages;

	$: if (currentPage > endPage) {
		currentPage = endPage;
	}

// export const statusMap:Record<string, string> = {
// 		PAYMENT_PENDING: 'Pendente',
// 		PAYMENT_PAID: 'Pago',
// 		PAYMENT_CANCELLED: 'Cancelado',
// 		PREPARING_ORDER: 'Preparando',
// 		SHIPPING_ORDER: 'Enviado',
// 		GENERATE_INVOICE: 'Nota gerada',
// 		SHIPPING_COMPLETE: 'Entregue'
// 	};

 interface OrderTracking {
	order_id: number;
	order_date: string;
	tracking_number: any;
	order_status: string;
}

    function openModal(order: OrderTracking) {
    selectedOrder = {
      order_id: order.order_id,
      order_date: order.order_date,
      order_status: order.order_status,
      tracking_number: order.tracking_number
    };
    isModalOpen = true;

    
  }

  function handleModalClose() {
    isModalOpen = false;
  }


    async function toggleTrackingFilter() {
    trackingFilter = !trackingFilter;
    searchParams.set('tracking_number', trackingFilter ? 'true' : 'false');
    searchParams.set('page', '1'); // Reset to first page when filtering
    await goto(`/admin/logistics?${searchParams.toString()}`);
  }

	async function handleRowsPerPageChange(event) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page
		searchParams.set('offset', `${rowsPerPage}`);
		searchParams.set('page', `${currentPage}`);
		goto(`/admin/logistics?page=${currentPage}&offset=${rowsPerPage}&tracking_number=${trackingFilter}`);
	}

	function firstPage() {
		currentPage = 1;
		goto(`/admin/logistics?page=${currentPage}&offset=${rowsPerPage}&tracking_number=${trackingFilter}`);
	}

	function nextPage() {
		console.log(currentPage);
		if (currentPage < endPage) {
			currentPage++;
			console.log(currentPage);
			goto(`/admin/logistics?page=${currentPage}&offset=${rowsPerPage}&tracking_number=${trackingFilter}`);
		}
	}

	function prevPage() {
		console.log(currentPage);
		if (currentPage > 1) {
			currentPage--;
			console.log(currentPage);
			goto(`/admin/logistics?page=${currentPage}&offset=${rowsPerPage}&tracking_number=${trackingFilter}`);
		}
	}

	function lastPage() {
		currentPage = data.totalPages;
		goto(`/admin/logistics?page=${currentPage}&offset=${rowsPerPage}&tracking_number=${trackingFilter}`);
	}

	function productMore(order_id: number) {
		goto(`/admin/logistics/more?order_id=${order_id}`);
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Orders</h1>
	</div>
    <div class="my-4">
        <button
          class={`px-4 py-2 rounded ${trackingFilter ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700'}`}
          on:click={toggleTrackingFilter}
        >
          Tracking Number
        </button>
      </div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell class="pl-0">Id</TableHeadCell>
				<TableHeadCell class="pl-0">User Name</TableHeadCell>
				<TableHeadCell class="pl-0">Order Date</TableHeadCell>
				<TableHeadCell class="pl-0">Order Status</TableHeadCell>
				<TableHeadCell class="">Ações</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each items as order}
					<TableBodyRow>
						<TableBodyCell tdClass="py-2">{order.order_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{order.user.name}</TableBodyCell>
						<TableBodyCell tdClass="py-2"
							>{new Date(order.order_date).toLocaleDateString()}</TableBodyCell
						>
						<TableBodyCell tdClass="py-2">{getStatusTranslation(order.order_status)}</TableBodyCell>
						<TableBodyCell tdClass="py-2">
							<Button variant="primary" on:click={() => openModal(order)}
								>Ver mais</Button
							>
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
    <LogisticsModal
  isOpen={isModalOpen}
  selectedOrder={selectedOrder}
  on:close={handleModalClose}
/>
</div>
