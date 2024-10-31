<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { couponsStore } from '$lib/stores/coupons';
	import { currencyFormat, formatPercentage } from '$lib/utils';
	import {
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Label,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Toast
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		CheckCircleSolid,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';

	export let data: any;

	const coupons = couponsStore();
	coupons.set({
		coupons: data.coupons.coupons,
		page: data.coupons.page,
		offset: data.coupons.offset,
		total_pages: data.coupons.total_pages,
		total_records: data.coupons.total_records
	});

	let debounceTimeout: ReturnType<typeof setTimeout>;
	let rowsPerPage = data.coupons.offset ?? 10;
	let currentPage = data.coupons.page ?? 1;
	let counter = 6;
	let searchTerm = '';
	let sortBy = 'user_id';
	let sortDirection = 'asc';
	let notification = false;

	$: items = data.coupons.coupons ?? [];
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.coupons.total_records);
	$: endPage = data.coupons.total_pages;
	$: searchTerm, debounceSearch(searchTerm);

	function debounceSearch(query: string) {
		console.log(query);
	}

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		notification = false;
	}

	function trigger() {
		notification = true;
		counter = 6;
		timeout();
	}

	async function refreshCoupons() {
		await coupons.get(
			`${data.base_url}/coupon/?offset=${rowsPerPage}&page=${currentPage}&order_by=${sortBy}&direction=${sortDirection}`,
			data.access_token
		);
	}

	function orderBy(sort_By: string) {
		if (sortBy === sort_By) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = sort_By;
			sortDirection = 'asc';
		}
		refreshCoupons();
	}

	async function handleRowsPerPageChange(event: any) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page

		await refreshCoupons();
	}

	async function firstPage() {
		currentPage = 1;

		await refreshCoupons();
	}

	async function nextPage() {
		if (currentPage < endPage) {
			currentPage++;

			await refreshCoupons();
		}
	}

	async function prevPage() {
		if (currentPage > 1) {
			currentPage--;

			await refreshCoupons();
		}
	}

	async function lastPage() {
		currentPage = data.coupons.total_pages;

		await refreshCoupons();
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Gestão de Cupons</h1>
	</div>
	<div class="my-4"></div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableSearch
				innerDivClass="p-0 my-2"
				placeholder="Buscar por cupom ou produto"
				hoverable={true}
				bind:inputValue={searchTerm}
			>
				<TableHead>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('user_id')}
						>ID</TableHeadCell
					>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('string_name')}
						>código</TableHeadCell
					>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('document')}
						>usuário</TableHeadCell
					>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('email')}
						>produto</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>desconto</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>situação</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>Quantidade</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>limite</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>comissão</TableHeadCell
					>

					<TableHeadCell class="">Ações</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each items as coupon}
						<TableBodyRow>
							<TableBodyCell tdClass="py-2">{coupon.coupon_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.code}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.user_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.product_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{currencyFormat(coupon.discount_price)}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.active}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{currencyFormat(coupon.qty)}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.limit_price}</TableBodyCell>
							<TableBodyCell tdClass="py-2"
								>{coupon.commission_percentage
									? formatPercentage(coupon.commission_percentage)
									: '0'}</TableBodyCell
							>
							<TableBodyCell tdClass="py-2">
								<Button
									variant="primary"
									additionalClass="w-full sm:w-auto sm:text-base text-sm py-1 px-2 sm:py-2 sm:px-4"
									>Gerenciar</Button
								>
								<Dropdown class="w-48 p-3 space-y-1">
									<DropdownItem>Detalhes</DropdownItem>
									<DropdownDivider />
									<DropdownItem>Deletar cupom</DropdownItem>
								</Dropdown>
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

			{start + 1}-{end} de {data.coupons.total_records}

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

	{#if notification}
		<Toast color="green" position="top-right">
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="w-5 h-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			Atualizado com Sucesso!
		</Toast>
	{/if}
</div>
