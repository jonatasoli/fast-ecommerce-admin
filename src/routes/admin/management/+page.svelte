<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { formatDocument } from '$lib/utils.js';
	import {
		Label,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toast,
		TableSearch
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		CheckCircleSolid,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { usersStore } from '$lib/stores/management';
	import ManagementModal from '$lib/components/management/modal/ManagementModal.svelte';

	export let data: any;

	const users = usersStore();
	users.set({
		users: data.users.users,
		page: data.users.page,
		offset: data.users.offset,
		total_pages: data.users.total_pages,
		total_records: data.users.total_records
	});

	let debounceTimeout: ReturnType<typeof setTimeout>;
	let notification = false;
	let rowsPerPage = data.users.offset ?? 10;
	let currentPage = data.users.page ?? 1;
	const searchParams = new URLSearchParams($page.url.searchParams);
	let trackingFilter = searchParams.get('tracking_number') === 'true' ? true : false;
	let isModalOpen = false;
	let counter = 6;
	let selectedUser = {
		user_id: 0,
		name: '',
		password: '',
		document: '',
		phone: '',
		role_id: 0,
		email: '',
		full_name: '',
		disabled: ''
	};

	let originalUser = {
		user_id: 0,
		name: '',
		password: '',
		document: '',
		phone: '',
		role_id: 0,
		email: '',
		full_name: '',
		disabled: ''
	};
	let searchTerm = '';

	$: items = data.users.users ?? [];
	$: start = currentPage * rowsPerPage - rowsPerPage;
	$: end = Math.min(start + rowsPerPage, data.users.total_records);
	$: endPage = data.users.total_pages;
	$: searchTerm, debounceSearch(searchTerm);

	$: if (currentPage > endPage) {
		currentPage = endPage;
	}

	users.subscribe(($store) => {
		items = $store.users;
		rowsPerPage = $store.offset;
		currentPage = $store.page;
		start = currentPage * rowsPerPage - rowsPerPage;
		end = Math.min(start + rowsPerPage, $store.total_records);
		endPage = $store.total_pages;
	});

	onMount(() => {
		refreshUsers();
	});

	interface selectedUser {
		user_id: number;
		name: string;
		password: string;
		document: string;
		phone: string;
		role_id: number;
		email: string;
		full_name: any;
		disabled: any;
	}

	function detectSearchType(query: string) {
		const isDocument = /^\d+$/.test(query); // Checa se contém apenas números
		return isDocument ? 'search_document' : 'search_name';
	}

	async function getUserByFilter(search_type: string, query: string) {
		await await users.get(
			`${data.base_url}/users/?${search_type}=${query}&offset=${rowsPerPage}&page=1`,
			data.access_token
		);
	}

	function debounceSearch(query: string) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			if (query.length > 3) {
				const searchType = detectSearchType(query);
				getUserByFilter(searchType, query);
			} else {
				refreshUsers();
			}
		}, 300);
	}

	function trigger() {
		notification = true;
		counter = 6;
		timeout();
	}

	async function handleSaveFromModal(event: any) {
		console.log('Valor recebido do modal:', event.detail.value);

		// Chamada HTTP usando o valor recebido
		const res = await users.patch(
			`${data.base_url}/user/${event.detail.value.user_id}`,
			event.detail.value,
			data.access_token
		);

		if (res) {
			trigger();
			refreshUsers();
		}
		return;
	}

	async function refreshUsers() {
		await users.get(
			`${data.base_url}/users/?offset=${rowsPerPage}&page=${currentPage}`,
			data.access_token
		);
	}

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		notification = false;
	}

	function openModal(user: selectedUser) {
		selectedUser = {
			user_id: user.user_id,
			name: user.name,
			password: '',
			document: user.document,
			phone: user.phone,
			role_id: user.role_id,
			email: user.email,
			full_name: user.full_name,
			disabled: user.disabled
		};

		originalUser = {
			user_id: user.user_id,
			name: user.name,
			password: '',
			document: user.document,
			phone: user.phone,
			role_id: user.role_id,
			email: user.email,
			full_name: user.full_name,
			disabled: user.disabled
		};

		isModalOpen = true;
	}

	function handleModalClose() {
		isModalOpen = false;
	}

	async function handleRowsPerPageChange(event: any) {
		rowsPerPage = parseInt(event.target.value);
		currentPage = 1; // Reset to first page
		searchParams.set('offset', `${rowsPerPage}`);
		searchParams.set('page', `${currentPage}`);
		await refreshUsers();
	}

	async function firstPage() {
		currentPage = 1;
		searchParams.set('page', currentPage);
		await refreshUsers();
	}

	async function nextPage() {
		if (currentPage < endPage) {
			console.log(currentPage);
			currentPage++;
			searchParams.set('page', currentPage);
			await refreshUsers();
		}
	}

	async function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			searchParams.set('page', currentPage);
			console.log(currentPage);
			await refreshUsers();
		}
	}

	async function lastPage() {
		currentPage = data.users.total_pages;
		searchParams.set('page', currentPage);
		await refreshUsers();
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Gestão de Usuários</h1>
	</div>
	<div class="my-4"></div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableSearch
				innerDivClass="p-0 my-2"
				placeholder="Buscar por nome ou documento"
				hoverable={true}
				bind:inputValue={searchTerm}
			>
				<TableHead>
					<TableHeadCell class="pl-0">ID</TableHeadCell>
					<TableHeadCell class="pl-0">Nome</TableHeadCell>
					<TableHeadCell class="pl-0">Documento</TableHeadCell>
					<TableHeadCell class="pl-0">Username</TableHeadCell>

					<TableHeadCell class="">Ações</TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each items as users}
						<TableBodyRow>
							<TableBodyCell tdClass="py-2">{users.user_id}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{users.name}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{formatDocument(users.document)}</TableBodyCell>
							<TableBodyCell tdClass="py-2">{users.email}</TableBodyCell>
							<TableBodyCell tdClass="py-2">
								<Button
									variant="primary"
									on:click={() => openModal(users)}
									additionalClass="w-full sm:w-auto sm:text-base text-sm py-1 px-2 sm:py-2 sm:px-4"
									>Gerenciar</Button
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

			{start + 1}-{end} de {data.users.total_records}

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
	<ManagementModal
		isOpen={isModalOpen}
		{selectedUser}
		{originalUser}
		on:close={handleModalClose}
		on:save={handleSaveFromModal}
	/>

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
