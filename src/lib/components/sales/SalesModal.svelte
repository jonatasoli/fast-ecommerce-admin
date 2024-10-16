<script lang="ts">
	import type { CancelledReason } from '$lib/types';
	import { Modal, Button, Input } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	export let isOpen: boolean = false;

	export let selectedOrder: number = 0;

	export let cancelled_reason: CancelledReason = {
		cancel_reason: ''
	};

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	async function saveChanges() {
		dispatch('save', { cancelled_reason, selectedOrder });
	}
</script>

<Modal bind:open={isOpen} on:close={closeModal} class="max-w-sm sm:max-w-2xl">
	<div class="p-4 space-y-4">
		<h3 class="text-lg font-semibold mb-4">Cancelar Pedido : {selectedOrder}</h3>

		<div class="mb-4">
			<label for="userId" class="block text-sm font-medium text-gray-700"
				>Motivo do Cancelamento</label
			>
			<Input
				id="userId"
				type="text"
				bind:value={cancelled_reason.cancel_reason}
				class="mt-1 w-full"
			/>
		</div>

		<div class="grid grid-cols-1 gap-2 sm:justify-end mt-4 sm:flex sm:flex-wrap">
			<Button variant="secondary" on:click={closeModal} class="w-full sm:w-auto">Cancelar</Button>
			<Button variant="primary" on:click={saveChanges} class=" w-full sm:w-auto">Salvar</Button>
		</div>
	</div>
</Modal>
