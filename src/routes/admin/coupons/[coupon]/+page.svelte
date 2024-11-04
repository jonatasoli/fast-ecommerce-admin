<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input, Spinner, Card } from 'flowbite-svelte';

	import type { Coupon, CouponData } from '$lib/types';
	import { currencyFormat, formatPercentage } from '$lib/utils';

	export let data: any;
	let isLoading = false;
	let isEditing = false;
	let coupon: Coupon = {
		code: '',
		user_id: null,
		product_id: null,
		discount_price: null,
		limit_price: null,
		active: true,
		qty: 0,
		affiliate_id: 0,
		discount: '',
		coupon_id: 0,
		commission_percentage: null
	};

	$: coupon = data.coupon;
	$: coupon ? coupon : (isLoading = true);

	function toggleEdit() {
		isEditing = !isEditing;
	}
</script>

<form class="md:w-[80vw] mt-8 mx-auto p-4 print:hidden" method="POST" action="?/saveCoupon">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Detalhes do Cupom {coupon.code}</h1>
		<Button variant="secondary" on:click={() => goto('/admin/coupons')}>Voltar</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		{#if isLoading}
			<div class="flex justify-center items-center">
				<Spinner size="10" />
			</div>
		{:else}
			<div class="flex flex-col gap-4 items-center justify-center w-full">
				<div class="w-full">
					<label for="code" class="block my-2 text-sm font-medium text-gray-700"
						>Código do Cupom
					</label><Input id="code" value={coupon.code} name="code" disabled={!isEditing} />

					{#if coupon.user_id}
						<label for="user" class="block my-2 text-sm font-medium text-gray-700"
							>Usuário
						</label><Input id="user" name="user_id" value={coupon.user_id} disabled={!isEditing} />
					{/if}

					{#if coupon.product_id}
						<label for="product" class="block my-2 text-sm font-medium text-gray-700"
							>Product
						</label><Input
							id="product"
							name="product_id"
							value={coupon.product_id}
							disabled={!isEditing}
						/>
					{/if}
					<label for="discount" class="block my-2 text-sm font-medium text-gray-700"
						>Desconto
					</label><Input
						id="discount"
						name="discount_price"
						value={currencyFormat(Number(coupon.discount_price))}
						disabled={!isEditing}
					/>

					<label for="status" class="block my-2 text-sm font-medium text-gray-700"
						>Status
					</label><Input
						id="status"
						value={coupon.active ? 'Ativo' : 'Inativo'}
						disabled={!isEditing}
					/>

					<label for="limit" class="block my-2 text-sm font-medium text-gray-700"
						>Limite de uso
					</label><Input id="limit" value={coupon.limit_price} disabled={!isEditing} />

					<label for="quantity" class="block my-2 text-sm font-medium text-gray-700"
						>Quantidade
					</label><Input id="quantity" value={coupon.qty} disabled={!isEditing} />

					<label for="commission" class="block my-2 text-sm font-medium text-gray-700"
						>Comissão
					</label><Input
						id="commission"
						value={coupon.commission_percentage
							? formatPercentage(coupon.commission_percentage)
							: ''}
						disabled={!isEditing}
					/>
				</div>
			</div>
			<div class="my-8 space-y-4 flex flex-col md:inline-block" role="group">
				<Button variant="primary" on:click={toggleEdit}>
					{isEditing ? 'Cancelar' : 'Editar'}
				</Button>
				<Button variant="primary" disabled={!isEditing} type="submit" class="">Salvar</Button>
			</div>
		{/if}
	</div>
</form>
