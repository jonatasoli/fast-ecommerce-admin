<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input, Spinner, Card, Select } from 'flowbite-svelte';
	import { _ } from 'svelte-i18n';
	import type { Coupon, CouponData } from '$lib/types';
	import { currencyFormat, formatPercentage, parsePercentage } from '$lib/utils';
	import { couponsStore } from '$lib/stores/coupons';

	export let data: any;
	const coupons = couponsStore();
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

	let roles = [
		{ value: false, name: 'Inativo' },
		{ value: true, name: 'Ativo' }
	];

	function toggleEdit() {
		isEditing = !isEditing;
	}

	function statusCoupon() {
		return coupon.active ? 'Ativo' : 'Inativo';
	}

	async function handleSaveCoupon() {
		const req = {
			coupon_id: coupon.coupon_id,
			code: coupon.code,
			user_id: coupon.user_id,
			product_id: coupon.product_id,
			discount: coupon.discount,
			discount_price: coupon.discount_price,
			limit_price: coupon.limit_price,
			qty: Number(coupon.qty) || null,
			commission_percentage: coupon.commission_percentage,
			active: coupon.active ? true : false
		};

		try {
			isLoading = true;
			const res = await coupons.patch(
				`
			${data.base_url}/coupon/${coupon.coupon_id}`,
				req,
				data.access_token
			);

			if (res) {
				isLoading = false;
				console.log(res);
			}
		} catch (error) {
			isLoading = false;
			console.log('Error fetching coupons:' + error);
		}
	}
</script>

<form class="md:w-[80vw] mt-8 mx-auto p-4 print:hidden">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">{$_('CouponsDetailsPage.CouponDetails')} {coupon.code}</h1>
		<Button variant="secondary" on:click={() => goto('/admin/coupons')}
			>{$_('CouponsDetailsPage.Back')}</Button
		>
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
						>{$_('CouponsDetailsPage.CouponCode')}
					</label><Input id="code" bind:value={coupon.code} name="code" disabled={!isEditing} />

					{#if coupon.user_id}
						<label for="user" class="block my-2 text-sm font-medium text-gray-700"
							>{$_('CouponsDetailsPage.User')}
						</label><Input
							id="user"
							name="user_id"
							bind:value={coupon.user_id}
							disabled={!isEditing}
						/>
					{/if}

					{#if coupon.product_id}
						<label for="product" class="block my-2 text-sm font-medium text-gray-700"
							>{$_('CouponsDetailsPage.Product')}
						</label><Input
							id="product"
							name="product_id"
							bind:value={coupon.product_id}
							disabled={!isEditing}
						/>
					{/if}

					{#if coupon.discount !== '0'}
						<label for="discount" class="block my-2 text-sm font-medium text-gray-700"
							>{$_('CouponsDetailsPage.DiscountAmount')}
						</label><Input
							id="discount"
							name="discount"
							bind:value={coupon.discount}
							disabled={!isEditing}
						/>
					{/if}
					<label for="discount_price" class="block my-2 text-sm font-medium text-gray-700"
						>{$_('CouponsDetailsPage.Discount')}
					</label><Input
						id="discount_price"
						name="discount_price"
						bind:value={coupon.discount_price}
						disabled={!isEditing}
					/>

					<label for="status" class="block my-2 text-sm font-medium text-gray-700"
						>{$_('CouponsDetailsPage.Status')}</label
					>

					<Select
						id="status"
						class="mt-1 w-full"
						bind:value={coupon.active}
						disabled={!isEditing}
						items={roles}
					/>

					<label for="limit" class="block my-2 text-sm font-medium text-gray-700"
						>{$_('CouponsDetailsPage.UsageLimit')}
					</label><Input
						id="limit"
						name="limit_price"
						bind:value={coupon.limit_price}
						disabled={!isEditing}
					/>

					<label for="quantity" class="block my-2 text-sm font-medium text-gray-700"
						>{$_('CouponsDetailsPage.Quantity')}
					</label><Input id="quantity" name="qty" bind:value={coupon.qty} disabled={!isEditing} />

					<label for="commission" class="block my-2 text-sm font-medium text-gray-700"
						>{$_('CouponsDetailsPage.CommissionPercentage')}
					</label><Input
						id="commission"
						name="commission_percentage"
						bind:value={coupon.commission_percentage}
						disabled={!isEditing}
					/>
				</div>
			</div>
			<div class="my-8 space-y-4 flex flex-col md:inline-block" role="group">
				<Button variant="primary" on:click={toggleEdit}>
					{isEditing ? 'Cancelar' : 'Editar'}
				</Button>
				<Button variant="primary" disabled={!isEditing} on:click={handleSaveCoupon} class=""
					>{$_('CouponsDetailsPage.Save')}</Button
				>
			</div>
		{/if}
	</div>
</form>
