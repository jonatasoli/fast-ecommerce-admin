<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { couponsStore } from '$lib/stores/coupons';
	import { currencyFormat, formatPercentage } from '$lib/utils';
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
		Toast,
		Button,
		Badge,
		Popover
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		CheckCircleSolid,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';
	import CreateCoupon from '$lib/components/coupon/modal/CreateCoupon.svelte';
	import { onMount } from 'svelte';

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
	let isModalOpen = false;
	let products = data.products;
	let users = data.users;
	let userDetails = data.userDetails;
	let details = {
		token: data.access_token,
		base_url: data.base_url
	};

	$: items = data.coupons.coupons ?? [];
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.coupons.total_records);
	$: endPage = data.coupons.total_records;
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

	async function handleModalClose() {
		isModalOpen = false;
		refreshCoupons();
		trigger();
	}

	async function refreshCoupons() {
		const res = await coupons.get(
			`${data.base_url}/coupon/?offset=${rowsPerPage}&page=${currentPage}`,
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
		currentPage = 1;

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

	function addCoupon() {
		isModalOpen = true;
	}

	async function inactiveCoupon(coupon_id: number) {
		await coupons.delete(`${data.base_url}/coupon/${coupon_id}`, data.access_token);

		refreshCoupons();
		trigger();
	}

	coupons.subscribe(($store) => {
		items = $store.coupons;
		rowsPerPage = $store.offset;
		currentPage = $store.page;
		start = currentPage * rowsPerPage - rowsPerPage;
		end = Math.min(start + rowsPerPage, $store.total_records);
		endPage = $store.total_records;
	});

	onMount(() => {
		refreshCoupons();
	});
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">{$_('coupons.title')}</h1>
		<Button class="bg-primary " on:click={addCoupon}>{$_('coupons.newCoupon')}</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableSearch
				innerDivClass="p-0 my-2"
				placeholder={$_('coupons.placeholderSearch')}
				hoverable={true}
				bind:inputValue={searchTerm}
			>
				<TableHead>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('user_id')}
						>{$_('coupons.table.id')}</TableHeadCell
					>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('string_name')}
						>{$_('coupons.table.code')}</TableHeadCell
					>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('document')}
						>{$_('coupons.table.user')}</TableHeadCell
					>
					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('email')}
						>{$_('coupons.table.product')}</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>{$_('coupons.table.discount')}</TableHeadCell
					>

					<TableHeadCell class="cursor-pointer" on:click={() => orderBy('role_id')}
						>{$_('coupons.table.status')}</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>{$_('coupons.table.quantity')}</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>{$_('coupons.table.limit')}</TableHeadCell
					>

					<TableHeadCell class="pl-0 cursor-pointer" on:click={() => orderBy('role_id')}
						>{$_('coupons.table.commission')}</TableHeadCell
					>

					<TableHeadCell>{$_('coupons.table.actions')}</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each items as coupon}
						<TableBodyRow>
							<TableBodyCell tdClass="py-2">{coupon.coupon_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.code}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.user_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.product_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{currencyFormat(coupon.discount_price)}</TableBodyCell>
							<TableBodyCell tdClass="py-2">
								<Badge
									class="w-32 text-center px-2 py-1 rounded-full border"
									border
									color={coupon.active ? 'green' : 'red'}
								>
									{coupon.active === true ? 'Ativo' : 'Inativo'}
								</Badge></TableBodyCell
							>
							<TableBodyCell tdClass="py-2">{coupon.qty}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{coupon.limit_price}</TableBodyCell>
							<TableBodyCell tdClass="py-2"
								>{coupon.commission_percentage
									? formatPercentage(coupon.commission_percentage)
									: '0'}</TableBodyCell
							>
							<TableBodyCell tdClass="py-2">
								<Button id={`btn-${coupon.coupon_id}`}>Gerenciar</Button>
								<Popover
									class="w-64 text-sm font-light"
									title={`Opções do Cupom ${coupon.code}`}
									triggeredBy={`#btn-${coupon.coupon_id}`}
								>
									<div class="flex flex-col space-y-2">
										<a href={`/admin/coupons/${coupon.coupon_id}`}>
											<Button variant="secondary" class="w-full text-left"
												>{$_('coupons.details')}</Button
											>
										</a>
										<Button
											variant="danger"
											class="w-full text-left"
											on:click={() => inactiveCoupon(coupon.coupon_id)}
										>
											{$_('coupons.desactiveCoupon')}
										</Button>
									</div>
								</Popover>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</TableSearch>
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

	<CreateCoupon
		isOpen={isModalOpen}
		{details}
		{products}
		{users}
		{userDetails}
		on:close={handleModalClose}
		on:cancel={() => (isModalOpen = false)}
	/>

	{#if notification}
		<Toast color="green" position="top-right">
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="w-5 h-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			{$_('toast.success')}
		</Toast>
	{/if}
</div>
