<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { ordersStore, getOrderById } from '$lib/stores/sales';

	export let orderId;
	export let data;
	let order = {
		order_id: '',
		affiliate_id: '',
		order_date: '',
		discount: '',
		tracking_number: '',
		order_status: '',
		user: {
			user_id: '',
			name: '',
			email: ''
		},
		freight: '',
		coupon_id: '',
		cancelled_reason: '',
		cancelled_at: ''
	};

	let showCancelReason = false;
	let showInvoiceLink = false;
	let showTrackingCode = false;

	let invoiceLink = '';
	let trackingCode = '';

	onMount(() => {
		const params = new URLSearchParams($page.url.searchParams);
		orderId = params.get('order_id');
		if (data.orders !== undefined) {
			order = getOrderById(orderId, data.orders.orders ?? []);
		} else {
			console.log('erros');
			console.log(data);
		}
	});

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
</script>

<div class="w-[60vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Editar Pedido {order.order_id}</h1>
		<Button variant="secondary" on:click={() => goto('/admin/sales')}>Voltar</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<form class="flex flex-col gap-4">
			<Input label="ID do Pedido" value={order.order_id} readonly />
			<Input label="ID do Afiliado" bind:value={order.affiliate_id} />
			<Input label="Data do Pedido" value={order.order_date} readonly />
			<Input label="Desconto" bind:value={order.discount} />
			<Input label="Status do Pedido" bind:value={order.order_status} readonly />
			<Input label="ID do Usuário" value={order.user.user_id} readonly />
			<Input label="Nome do Usuário" value={order.user.name} readonly />
			<Input label="Email do Usuário" value={order.user.email} readonly />
			<Input label="Tipo de Frete" bind:value={order.freight} />
			<Input label="ID do Cupom" bind:value={order.coupon_id} />
		</form>
		<div class="my-8 space-y-4" role="group">
			<Button variant="primary" on:click={cancelOrder}>Cancelar Venda</Button>
			<Button variant="primary" on:click={submitInvoice}>Anexar nota fiscal</Button>
			<Button variant="primary" on:click={submitTrackingCode}>Código de Rastreio</Button>
			{#if showCancelReason}
				<Input label="Motivo do Cancelamento" bind:value={order.cancelled_reason} />
				<Button variant="secondary">Confirmar Cancelamento</Button>
			{/if}
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
