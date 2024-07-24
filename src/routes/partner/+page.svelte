<script lang="ts">
	import { StoreSolid, TableRowSolid } from 'flowbite-svelte-icons';
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/partner/coupons">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<StoreSolid class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Meus Cupons</p>
		</div>
	</a>
</div>

<div class="w-[90vw] mt-8 mx-auto">
	<a href="/partner/commissions">
		<div
			class="flex flex-col gap-2 w-60 p-4 justify-center items-center shadow-lg border border-gray-200"
		>
			<TableRowSolid class="text-primary h-8 w-8" />
			<p class="font-bold text-lg">Comissões</p>
		</div>
	</a>
</div>
