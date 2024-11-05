<script lang="ts">
	import type { Coupon } from '$lib/types';
	import { Modal, Button, Input, Select } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isOpen: boolean = false;

	export let coupon: Coupon = {
		product_id: 88,
		affiliate_id: 52,
		code: 'J100X',
		user_id: 40,
		discount_price: '150.00',
		limit_price: '300.00',
		active: true,
		qty: 100,
		discount: '10.00',
		commission_percentage: '0.1'
	};

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	async function createCoupon() {
		console.log(coupon);
	}
</script>

<Modal bind:open={isOpen} on:close={closeModal} size="md">
	<div class="p-4 space-y-4">
		<h3 class="text-lg font-semibold mb-4">Detalhes do Cupom</h3>

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="productId" class="block text-sm font-medium text-gray-700">ID do Produto</label>
				<Input id="productId" type="text" value={coupon.product_id} readonly class="mt-1 w-full" />
			</div>

			<div class="mb-4 flex-1">
				<label for="affiliateId" class="block text-sm font-medium text-gray-700"
					>ID do Afiliado</label
				>
				<Input id="affiliateId" type="text" bind:value={coupon.affiliate_id} class="mt-1 w-full" />
			</div>
		</div>

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="code" class="block text-sm font-medium text-gray-700">Código do Cupom</label>
				<Input id="code" type="text" bind:value={coupon.code} class="mt-1 w-full" />
			</div>

			<div class="mb-4 flex-1">
				<label for="userId" class="block text-sm font-medium text-gray-700">ID do Usuário</label>
				<Input id="userId" type="text" value={coupon.user_id} readonly class="mt-1 w-full" />
			</div>
		</div>

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="discountPrice" class="block text-sm font-medium text-gray-700"
					>Preço com Desconto</label
				>
				<Input
					id="discountPrice"
					type="text"
					bind:value={coupon.discount_price}
					class="mt-1 w-full"
				/>
			</div>

			<div class="mb-4 flex-1">
				<label for="limitPrice" class="block text-sm font-medium text-gray-700">Preço Limite</label>
				<Input id="limitPrice" type="text" bind:value={coupon.limit_price} class="mt-1 w-full" />
			</div>
		</div>

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="active" class="block text-sm font-medium text-gray-700">Ativo</label>
				<Select id="active" bind:value={coupon.active} class="mt-1 w-full">
					<option value={true}>Sim</option>
					<option value={false}>Não</option>
				</Select>
			</div>

			<div class="mb-4 flex-1">
				<label for="qty" class="block text-sm font-medium text-gray-700">Quantidade</label>
				<Input id="qty" type="number" bind:value={coupon.qty} class="mt-1 w-full" />
			</div>
		</div>

		<div class="mb-4">
			<label for="discount" class="block text-sm font-medium text-gray-700">Desconto</label>
			<Input id="discount" type="text" bind:value={coupon.discount} class="mt-1 w-full" />
		</div>

		<div class="flex flex-wrap justify-end space-x-2 mt-4">
			<Button variant="secondary" on:click={closeModal} class="w-full sm:w-auto">Cancelar</Button>
			<Button variant="primary" on:click={createCoupon} class="w-full sm:w-auto">Salvar</Button>
		</div>
	</div>
</Modal>
