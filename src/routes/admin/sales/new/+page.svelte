<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Input, Spinner, Card } from 'flowbite-svelte';
	import { getOrderById } from '$lib/stores/sales';
	import { getStatusTranslation, paymentMethodMap } from '$lib/utils';
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
			phone: '',
			addresses: []
		},
		freight: '',
		coupon_id: '',
		customer_id: '',
		items: [],
		payment: {
			payment_id: 0,
			order_id: 0,
			amount: '',
			token: ',',
			gateway_payment_id: 0,
			status: '',
			authorization: '',
			payment_method: '',
			payment_gateway: '',
			amount_with_fee: '',
			freight_amount: ''
		}
	};

	let showCancelReason = false;
	let showInvoiceLink = false;
	let showTrackingCode = false;
	let printContent = false;

	let invoiceLink = '';
	let trackingCode = '';

	function printPage() {
		printContent = true;
		setTimeout(() => {
			window.print();
			printContent = false;
		}, 150);
	}

	function getOrder() {
		order = data.orders;
		isLoading = false;
	}

	async function cancelOrder() {
		console.log('Cancel order');
		showCancelReason = !showCancelReason;
		console.log(showCancelReason);
		showInvoiceLink = false;
		showTrackingCode = false;
		console.log(showInvoiceLink);
		console.log(showTrackingCode);
	}

	async function submitInvoice() {
		console.log('Submit invoice', invoiceLink);
		showInvoiceLink = !showInvoiceLink;
		console.log(showInvoiceLink);
		showTrackingCode = false;
		showCancelReason = false;
		console.log(showTrackingCode);
		console.log(showCancelReason);
	}

	function getAdress(orderUser: any) {
		return `${orderUser.addresses[0].street} , ${orderUser.addresses[0].neighborhood}, ${orderUser.addresses[0].street_number}`;
	}

	function getState(orderUser: any) {
		return `${orderUser.addresses[0].city} , ${orderUser.addresses[0].state}, ${orderUser.addresses[0].country} `;
	}

	function currencyFormatFreight(value: number, locale = 'pt-BR', type?: string): string {
		if (value === 0.01 && type === 'freight') {
			return 'Grátis';
		}

		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	onMount(() => {
		getOrder();
	});
</script>

<div class="w-[60vw] mt-8 mx-auto print:hidden">
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
					<label for="username" class="block text-sm font-medium text-gray-700"
						>Usuário
					</label><Input id="username" value={order.user.name} readonly />
				</div>

				<div>
					<label for="address" class="block text-sm font-medium text-gray-700"
						>Endereço
					</label><Input id="address" value={getAdress(order.user)} readonly />
				</div>

				<div>
					<label for="cep" class="block text-sm font-medium text-gray-700">CEP </label><Input
						id="cep"
						value={order.user.addresses[0].zipcode}
						readonly
					/>
				</div>

				<div>
					<label for="state" class="block text-sm font-medium text-gray-700"
						>Residencia
					</label><Input id="state" value={getState(order.user)} readonly />
				</div>

				<div>
					<label for="payment_type" class="block text-sm font-medium text-gray-700"
						>Método de pagamento
					</label><Input
						id="payment_type"
						value={order.payment?.payment_method
							? paymentMethodMap[order.payment.payment_method]
							: ''}
						readonly
					/>
				</div>

				<div>
					<label for="document" class="block text-sm font-medium text-gray-700"
						>Documento
					</label><Input id="document" value={order.user.document} readonly />
				</div>

				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700">Telefone </label><Input
						id="phone"
						value={order.user.phone}
						readonly
					/>
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
					<label for="ID do Pedido" class="block text-sm font-medium text-gray-700"
						>Status do Pedido
					</label><Input
						id="Status do Pedido"
						value={getStatusTranslation(order.order_status)}
						readonly
					/>
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
					</label><Input id="frete" bind:value={order.freight} readonly />
				</div>

				<div>
					<label for="freight_amount" class="block text-sm font-medium text-gray-700"
						>Valor do Frete
					</label><Input
						id="freight_amount"
						value={currencyFormatFreight(
							Number(order.payment?.freight_amount),
							undefined,
							'freight'
						)}
						readonly
					/>
				</div>

				<div>
					<label for="total" class="block text-sm font-medium text-gray-700"
						>Valor Total
					</label><Input
						id="total"
						value={currencyFormat(Number(order.payment?.amount))}
						readonly
					/>
				</div>
			</form>
		{/if}
		<div class="my-8 space-y-4" role="group">
			<Button variant="primary" on:click={cancelOrder}>Cancelar Venda</Button>
			<Button variant="primary" on:click={submitInvoice}>Anexar nota fiscal</Button>
			<Button variant="primary" on:click={printPage}>Imprimir Pedido</Button>
			{#if showInvoiceLink}
				<Input label="Link da Nota Fiscal" bind:value={invoiceLink} />
				<Button variant="secondary" on:click={submitInvoice}>Enviar Nota Fiscal</Button>
			{/if}
		</div>
	</div>
</div>
{#if printContent}
	<div class="print:block p-6 max-w-5xl mx-auto mt-8 bg-white shadow-lg">
		<div class="flex justify-between items-center mb-6 border-b pb-4">
			<div>
				<h1 class="text-2xl font-bold">Detalhes do Pedido</h1>
				<p class="text-sm text-gray-500">Pedido ID: {order.order_id}</p>
			</div>
			<div>
				<p class="text-lg font-semibold">Data: {new Date(order.order_date).toLocaleDateString()}</p>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 mb-8">
			<div>
				<h2 class="text-xl font-semibold mb-2">Informações do Cliente</h2>
				<p><strong>Nome:</strong> {order.user.name}</p>
				<p><strong>Documento:</strong> {order.user.document}</p>
				<p><strong>Telefone:</strong> {order.user.phone}</p>
				<p><strong>E-mail:</strong> {order.user.email}</p>
			</div>
			<div>
				<h2 class="text-xl font-semibold mb-2">Endereço de Entrega</h2>
				<p><strong>Endereço:</strong> {getAdress(order.user)}</p>
				<p><strong>CEP:</strong> {order.user.addresses[0].zipcode}</p>
				<p><strong>Residência:</strong> {getState(order.user)}</p>
			</div>
		</div>

		<div class="mb-8">
			<h2 class="text-xl font-semibold mb-4">Produtos</h2>
			<table class="w-full table-auto">
				<thead class="bg-gray-100 border-b">
					<tr>
						<th class="text-left py-2 px-4">Produto</th>
						<th class="text-right py-2 px-4">Preço</th>
						<th class="text-right py-2 px-4">Quantidade</th>
						<th class="text-right py-2 px-4">Desconto</th>
						<th class="text-right py-2 px-4">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each order.items as item}
						<tr class="border-b odd:bg-white even:bg-gray-100">
							<td class="py-2 px-4">{item.product.name}</td>
							<td class="text-right py-2 px-4">{currencyFormat(item.product.price)}</td>
							<td class="text-right py-2 px-4">{item.quantity}</td>
							<td class="text-right py-2 px-4">{currencyFormat(Number(item.discount_price))}</td>
							<td class="text-right py-2 px-4">
								{currencyFormat(item.product.price * item.quantity - Number(item.discount_price))}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-8 flex justify-end space-x-8">
			<div class="text-right">
				<p>
					<strong>Frete:</strong>
					{currencyFormatFreight(Number(order.payment?.freight_amount))}
				</p>
				<p><strong>Total do Pedido:</strong> {currencyFormat(Number(order.payment?.amount))}</p>
			</div>
		</div>
	</div>
{/if}
