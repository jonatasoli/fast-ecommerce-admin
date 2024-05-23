<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { currencyFormat } from '$lib/utils.js';
	import {
	Label,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline
	} from 'flowbite-svelte-icons';

	export let data;
	console.log(data);

	let rowsPerPage = 10;
	let currentPage = 1;

	$: items = data.inventory;

</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Estoque</h1>
		<Button variant="primary" >Atualizar estoque</Button>
	</div>

	<div class="w-full mx-auto mt-12">
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell>Id</TableHeadCell>
				<TableHeadCell>Produto</TableHeadCell>
				<TableHeadCell>Quantidade</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each items as inventory}
					<TableBodyRow>
						<TableBodyCell tdClass="py-2">{inventory.product_id}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{inventory.name}</TableBodyCell>
						<TableBodyCell tdClass="py-2">{inventory.quantity}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
