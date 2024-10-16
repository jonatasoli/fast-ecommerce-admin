<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input, Spinner, Card } from 'flowbite-svelte';
	import { getOrderById } from '$lib/stores/sales';
	import { getStatusTranslation } from '$lib/utils.js';
	import type { DataSalesOrders } from '$lib/types';
	import { currencyFormat } from '$lib/utils';

	export let orderId;
	export let data;
	let isLoading = true;
	let order: DataSalesOrders = {
		order_id: 0,
		affiliate_id: '',
		order_date: '',
		discount: '',
		tracking_number: '',
		order_status: '',
		user: {
			user_id: 0,
			name: '',
			email: '',
			document: '',
			phone: ''
		},
		freight: '',
		coupon_id: '',
		customer_id: '',
		items: []
	};

	let showCancelReason = false;
	let showInvoiceLink = false;
	let showTrackingCode = false;

	let invoiceLink = '';
	let trackingCode = '';

	function getOrder() {
		order = data.orders;
		isLoading = false;
	}

	async function cancelOrder() {
		// Lógica para cancelar o pedido
		console.log('Cancel order');
		showCancelReason = !showCancelReason;
		console.log(showCancelReason);
		showInvoiceLink = false;
		showTrackingCode = false;
		console.log(showInvoiceLink);
		console.log(showTrackingCode);
	}

	async function submitInvoice() {
		// Lógica para enviar link da nota fiscal
		console.log('Submit invoice', invoiceLink);
		showInvoiceLink = !showInvoiceLink;
		console.log(showInvoiceLink);
		showTrackingCode = false;
		showCancelReason = false;
		console.log(showTrackingCode);
		console.log(showCancelReason);
	}

	async function submitTrackingCode() {
		// Lógica para enviar código de rastreamento
		console.log('Submit tracking code', trackingCode);
		showTrackingCode = !showTrackingCode;
		console.log(showTrackingCode);
		showInvoiceLink = false;
		showCancelReason = false;
		console.log(showInvoiceLink);
		console.log(showCancelReason);
	}

	onMount(() => {
		getOrder();
	});
</script>

<div class="w-[60vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Editar Pedido {order.order_id}</h1>
		<Button variant="secondary" on:click={() => goto('/admin/sales')}>Voltar</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		{#if isLoading}
			<div class="flex justify-center items-center">
				<Spinner size="10" />
			</div>
		{:else}
			<form class="flex flex-col gap-4">
				<div class="mb-4">
					<label for="produtos" class="block text-sm font-medium text-gray-700">Produtos </label>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						{#each order.items as items}
							<Card
								class="mt-4 sm:max-w-md xl:max-w-lg shadow-md transition-transform transform hover:scale-105"
							>
								<div class="sm:p-6 flex flex-col items-center">
									<h3 class="text-lg font-semibold text-center mb-2">{items.product.name}</h3>
									<p class="text-gray-600">Preço: {currencyFormat(items.product.price)}</p>
									<p class="text-gray-600">Quantidade: {items.quantity}</p>
									<p class="text-gray-600 mt-2">
										Desconto: {currencyFormat(Number(items.discount_price))}
									</p>
								</div>
							</Card>
						{/each}
					</div>
				</div>
				<div>
					<label for="IdOrder" class="block text-sm font-medium text-gray-700">ID do Pedido</label>
					<Input id="IdOrder" value={order.order_id} readonly />
				</div>

				<div>
					<label for="IdAffiliate" class="block text-sm font-medium text-gray-700"
						>ID da Afiliação
					</label>

					<Input id="IdAffiliate" bind:value={order.affiliate_id} />
				</div>

				<div>
					<label for="orderDate" class="block text-sm font-medium text-gray-700"
						>Data do Pedido
					</label>
					<Input
						id="Data do Pedido"
						value={new Date(order.order_date).toLocaleDateString()}
						readonly
					/>
				</div>
				<div>
					<label for="ID do Pedido" class="block text-sm font-medium text-gray-700">Desconto</label>
					<Input id="Desconto" bind:value={order.discount} />
				</div>

				<div>
					<label for="ID do Pedido" class="block text-sm font-medium text-gray-700"
						>Status do Pedido
					</label><Input
						id="Status do Pedido"
						value={getStatusTranslation(order.order_status)}
						readonly
					/>
				</div>
				<div>
					<label for="IdUser" class="block text-sm font-medium text-gray-700"
						>ID do Usuário
					</label><Input id="IdUser" value={order.user.user_id} readonly />
				</div>
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700"
						>Usuário
					</label><Input id="username" value={order.user.name} readonly />
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">E-mail </label><Input
						id="email"
						value={order.user.email}
						readonly
					/>
				</div>
				<div>
					<label for="frete" class="block text-sm font-medium text-gray-700"
						>Tipo do Frete
					</label><Input id="frete" bind:value={order.freight} />
				</div>
				<div>
					<label for="IdCoupon" class="block text-sm font-medium text-gray-700"
						>ID do Cupom
					</label><Input id="IdCoupon" value={order.coupon_id ?? 'sem cupom'} />
				</div>
			</form>
		{/if}
		<div class="my-8 space-y-4" role="group">
			<Button variant="primary" on:click={cancelOrder}>Cancelar Venda</Button>
			<Button variant="primary" on:click={submitInvoice}>Anexar nota fiscal</Button>
			<Button variant="primary" on:click={submitTrackingCode}>Código de Rastreio</Button>
			{#if showInvoiceLink}
				<Input label="Link da Nota Fiscal" bind:value={invoiceLink} />
				<Button variant="secondary" on:click={submitInvoice}>Enviar Nota Fiscal</Button>
			{/if}
			{#if showTrackingCode}
				<Input label="Código de Rastreamento" bind:value={trackingCode} />
				<Button variant="secondary" on:click={submitTrackingCode}
					>Enviar Código de Rastreamento</Button
				>
			{/if}
		</div>
	</div>
</div>
