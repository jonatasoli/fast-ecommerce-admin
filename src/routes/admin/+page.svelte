<script lang="ts">
	import { DatabaseSolid, StoreSolid, TableRowSolid, FileInvoiceSolid, TruckSolid, AdjustmentsHorizontalSolid, SalePercentSolid } from 'flowbite-svelte-icons';
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

