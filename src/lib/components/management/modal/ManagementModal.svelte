<script lang="ts">
	import { getRoleName, setRoleId } from '$lib/utils';
	import { Modal, Button, Input, Select } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	interface selectedUser {
		user_id: number;
		name: string;
		password: string | null;
		document: string;
		phone: string;
		role_id: number;
		email: string;
		full_name: any;
		disabled: any;
	}

	export let isOpen: boolean = false;

	export let selectedUser: selectedUser = {
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

	export let originalUser: selectedUser = {
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

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function updatedModal() {
		dispatch('updatedTrackingNumber');
		closeModal();
	}

	function getRoleOptions(roleId: number): Array<{ value: string; label: string }> {
		switch (roleId) {
			case 1: // Admin
				return [
					{ value: 'USER', label: 'User' },
					{ value: 'PARTNER', label: 'Partner' }
				];
			case 2: // User
				return [
					{ value: 'ADMIN', label: 'Admin' },
					{ value: 'PARTNER', label: 'Partner' }
				];
			case 3: // Partner
				return [
					{ value: 'ADMIN', label: 'Admin' },
					{ value: 'USER', label: 'User' }
				];
			default:
				return [];
		}
	}

	function handleRoleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedUser.role_id = setRoleId(target.value);
	}

	function roleChanged(): boolean {
		return originalUser.role_id !== selectedUser.role_id;
	}

	function userFieldsChanged(): boolean {
		return (
			originalUser.name !== selectedUser.name ||
			originalUser.document !== selectedUser.document ||
			originalUser.phone !== selectedUser.phone ||
			originalUser.email !== selectedUser.email
		);
	}

	async function updateRole() {
		console.log('original role:' + originalUser.role_id, 'selected role:' + selectedUser.role_id);

		console.log('Updating role...');
	}

	async function updateUser() {
		console.log('original user: ' + originalUser + ', selected user: ' + selectedUser);

		console.log('Updating user fields...');
	}

	async function saveChanges() {
		if (userFieldsChanged()) {
			await updateUser();
		}

		if (roleChanged()) {
			await updateRole();
		}

		dispatch('updatedUser');
	}

	onMount(() => {
		originalUser = selectedUser;
	});
</script>

<Modal bind:open={isOpen} on:close={closeModal} size="md">
	<div class="p-4 space-y-4">
		<h3 class="text-lg font-semibold mb-4">Detalhes do Usuário</h3>

		<div class="mb-4">
			<label for="userId" class="block text-sm font-medium text-gray-700">ID do Usuário</label>
			<Input id="userId" type="text" value={selectedUser.user_id} readonly class="mt-1 w-full" />
		</div>

		<div class="mb-4">
			<label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
			<Input id="name" type="text" bind:value={selectedUser.name} class="mt-1 w-full" />
		</div>

		<div class="mb-4">
			<label for="userDocument" class="block text-sm font-medium text-gray-700">Documento</label>
			<Input id="userDocument" type="text" bind:value={selectedUser.document} class="mt-1 w-full" />
		</div>

		<div class="mb-4">
			<label for="userPhone" class="block text-sm font-medium text-gray-700">Telefone</label>
			<Input id="userPhone" type="text" bind:value={selectedUser.phone} class="mt-1 w-full" />
		</div>

		<div class="mb-4">
			<label for="userEmail" class="block text-sm font-medium text-gray-700">Email</label>
			<Input id="userEmail" type="text" bind:value={selectedUser.email} class="mt-1 w-full" />
		</div>

		<div class="mb-4">
			<label for="userRole" class="block text-sm font-medium text-gray-700">Papel</label>
			<Select id="userRole" class="mt-1 w-full" on:change={handleRoleChange}>
				<!-- Exibir o papel atual como selecionado -->
				<option value={getRoleName(selectedUser.role_id)} selected>
					{getRoleName(selectedUser.role_id)}
				</option>

				<!-- Exibir outras opções disponíveis -->
				{#each getRoleOptions(selectedUser.role_id) as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-wrap justify-end space-x-2 mt-4">
			<Button variant="secondary" on:click={closeModal} class="w-full sm:w-auto">Cancelar</Button>
			<Button variant="primary" on:click={saveChanges} class="w-full sm:w-auto">Salvar</Button>
		</div>
	</div>
</Modal>
