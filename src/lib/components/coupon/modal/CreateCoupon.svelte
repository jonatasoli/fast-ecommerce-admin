<script lang="ts">
	import { couponsStore } from '$lib/stores/coupons';
	import type { Coupon } from '$lib/types';
	import { Modal, Button, Input, Select } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let isOpen: boolean = false;
	export let products;
	export let users;
	export let userDetails;
	export let details: any;

	let percentList = [
		{ value: 0.05, name: '5%' },
		{ value: 0.1, name: '10%' },
		{ value: 0.2, name: '20%' },
		{ value: 0.3, name: '30%' },
		{ value: 0.4, name: '40%' },
		{ value: 0.5, name: '50%' }
	];

	export let coupon: Coupon = {
		product_id: { value: 0, name: '' },
		affiliate_id: { value: 0, name: '' },
		code: '',
		user_id: null,
		discount_price: '150',
		limit_price: '300',
		active: true,
		qty: 100,
		discount: '0',
		commission_percentage: { value: 0, name: '' }
	};

	const dispatch = createEventDispatcher();
	const coupons = couponsStore();

	function closeModal() {
		dispatch('close');
	}

	function cancelModal() {
		dispatch('cancel');
	}

	async function createCoupon() {
		const payload = {
			...coupon,
			product_id: coupon.product_id.value === 0 ? null : coupon.product_id.value,
			// user_id: coupon.user_id ? coupon.product_id.value : null,
			affiliate_id: coupon.affiliate_id.value === 0 ? null : coupon.affiliate_id.value,
			commission_percentage:
				coupon.commission_percentage.value === 0 ? null : coupon.commission_percentage.value
		};

		const res = coupons.post(`${details.base_url}/coupon/`, payload, details.token);

		if (res) {
			closeModal();
		}
	}

	function handleProductChange(event: any) {
		coupon.product_id.value = parseInt(event.target.value);
	}

	function handleUserAffiliateChange(event: any) {
		coupon.affiliate_id.value = parseInt(event.target.value);
	}

	function handlePercentChange(event: any) {
		coupon.commission_percentage.value = Number(event.target.value);
	}
</script>

<Modal bind:open={isOpen} on:close={cancelModal} size="md">
	<div class="p-4 space-y-4">
		<h3 class="text-lg font-semibold mb-4">Detalhes do Cupom</h3>

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="productId" class="block text-sm font-medium text-gray-700">ID do Produto</label>
				<Select
					variant="outlined"
					bind:value={coupon.product_id.name}
					noLabel
					class="w-full"
					placeholder="Escolha uma opção"
					on:change={handleProductChange}
				>
					{#each products.inventory as product}
						<option value={product.product_id}>{product.name}</option>
					{/each}
				</Select>
			</div>

			<div class="mb-4 flex-1">
				<label for="affiliateId" class="block text-sm font-medium text-gray-700">Vendedor</label>
				<Select
					variant="outlined"
					bind:value={coupon.affiliate_id.name}
					noLabel
					class="w-full"
					placeholder="Escolha uma opção"
					on:change={handleUserAffiliateChange}
				>
					{#each users.users as user}
						<option value={user.user_id}>{user.name}</option>
					{/each}
				</Select>
			</div>
		</div>

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="code" class="block text-sm font-medium text-gray-700">Código do Cupom</label>
				<Input
					id="code"
					type="text"
					bind:value={coupon.code}
					placeholder="Escreva um Código"
					class="mt-1 w-full"
				/>
			</div>

			<div class="mb-4 flex-1">
				<label for="userId" class="block text-sm font-medium text-gray-700">Vincular Cupom ao Usuário</label>
				<Input id="userId" type="text" bind:value={coupon.user_id} readonly disabled class="mt-1 w-full" />
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

		<div class="flex justify-between gap-2">
			<div class="mb-4 flex-1">
				<label for="commission" class="block text-sm font-medium text-gray-700">Comissão</label>
				<Select
					variant="outlined"
					bind:value={coupon.commission_percentage.value}
					noLabel
					class="w-full"
					placeholder="Escolha uma opção"
					on:change={handlePercentChange}
					items={percentList}
				></Select>
			</div>
		</div>

		<div class="flex flex-wrap justify-end space-x-2 mt-4">
			<Button variant="secondary" on:click={cancelModal} class="w-full sm:w-auto">Cancelar</Button>
			<Button variant="primary" on:click={createCoupon} class="w-full sm:w-auto">Salvar</Button>
		</div>
	</div>
</Modal>
