<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { commissionsStore } from '$lib/stores/commissions';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Badge
	} from 'flowbite-svelte';
	import { _ } from 'svelte-i18n';
	import { currencyFormat } from '$lib/utils';

	export let data: any;
	let searchTerm = '';

	const commissions = commissionsStore();
	commissions.set({
		commissions: data.commissions.commissions,
		page: data.commissions.page,
		offset: data.commissions.offset,
		total_pages: data.commissions.total_pages,
		total_records: data.commissions.total_records
	});

	let rowsPerPage = data.commissions.offset ?? 10;
	let currentPage = data.commissions.page ?? 1;

	$: items = data.commissions.commissions;
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.commissions.total_records);
	$: endPage = data.commissions.total_pages;
	$: if (currentPage > endPage) {
		currentPage = endPage;
	}
	commissions.subscribe(($store) => {
		items = $store.commissions;
		rowsPerPage = $store.offset;
		currentPage = $store.page;
		start = currentPage * rowsPerPage - rowsPerPage;
		end = Math.min(start + rowsPerPage, $store.total_records);
		endPage = $store.total_pages;
	});
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">{$_('CommissionsPage.CommissionsManagement')}</h1>
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
					<TableHeadCell class="pl-0 cursor-pointer">{$_('CommissionsPage.OrderID')}</TableHeadCell>
					<TableHeadCell class="pl-0 cursor-pointer">{$_('CommissionsPage.User')}</TableHeadCell>
					<TableHeadCell class="pl-0 cursor-pointer"
						>{$_('CommissionsPage.Commission')}</TableHeadCell
					>
					<TableHeadCell class="cursor-pointer">{$_('CommissionsPage.Payment')}</TableHeadCell>

					<TableHeadCell class=" pl-2 cursor-pointer"
						>{$_('CommissionsPage.CommissionStatus')}</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer"
						>{$_('CommissionsPage.PaymentID')}</TableHeadCell
					>

					<TableHeadCell class="">{$_('CommissionsPage.Actions')}</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each items as commission}
						<TableBodyRow>
							<TableBodyCell tdClass="py-2">{commission.order_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{commission.user.name}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{currencyFormat(commission.commission)}</TableBodyCell>
							<TableBodyCell tdClass="py-2"
								><Badge
									class="w-32 text-center px-2 py-1 rounded-full border"
									border
									color={commission.paid ? 'green' : 'red'}
								>
									{commission.paid ? 'Pago' : 'Não pago'}
								</Badge>
							</TableBodyCell>
							<TableBodyCell tdClass="py-2">
								<Badge
									class="w-32 text-center px-2 py-1 rounded-full border"
									border
									color={commission.active ? 'green' : 'red'}
								>
									{commission.active ? 'Ativo' : 'Inativo'}
								</Badge></TableBodyCell
							>
							<TableBodyCell tdClass="py-2">{commission.payment_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">
								<Button
									variant="primary"
									additionalClass="w-full sm:w-auto sm:text-base text-sm py-1 px-2 sm:py-2 sm:px-4"
									>{$_('CommissionsPage.Actions')}</Button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</TableSearch>
		</Table>
	</div>
</div>
