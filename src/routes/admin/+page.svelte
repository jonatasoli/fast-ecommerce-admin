<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		StoreSolid,
		TableRowSolid,
		FileInvoiceSolid,
		TruckSolid,
		AdjustmentsHorizontalSolid,
		SalePercentSolid,
		UserSettingsSolid,
		TicketSolid,
		ChartMixedDollarSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		console.log('token');
		if (data.token && data.role === 'ADMIN') {
			goto('/admin');
		} else if (data.token && data.role === 'AFFILIATE') {
			goto('/partner');
		} else {
			goto('/');
		}
	});
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/products">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<StoreSolid class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Produtos</p>
		</div>
	</a>
</div>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/inventory">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<TableRowSolid class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Estoque</p>
		</div>
	</a>
</div>
<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/invoices">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<FileInvoiceSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Fiscal</p>
		</div>
	</a>
</div>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/logistics">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<TruckSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Logistica</p>
		</div>
	</a>
</div>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/coupons">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<TicketSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Cupons</p>
		</div>
	</a>
</div>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/management">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<UserSettingsSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Gestão de Usuários</p>
		</div>
	</a>
</div>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/commissions">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<ChartMixedDollarSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Comissões</p>
		</div>
	</a>
</div>
<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/settings">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<AdjustmentsHorizontalSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Configurações</p>
		</div>
	</a>
</div>
<div class="w-[90vw] mt-8 mx-auto">
	<a href="/admin/sales">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<SalePercentSolid size="lg" class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Vendas</p>
		</div>
	</a>
</div>
