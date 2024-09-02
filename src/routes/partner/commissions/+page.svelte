<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import {
		Dropdown,
		DropdownItem,
		Label,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { CashSolid, ChevronDownOutline } from 'flowbite-svelte-icons';
	export let data;
	console.log('comissoes');
	console.log(data);

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
	}
	function formatCurrency(value) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}

	const totalCommissions = data.commissions.reduce((total, commission) => {
		return total + commission.commission;
	}, 0);

	const totalReleasedCommissions = data.commissions.reduce((total, commission) => {
		return commission.released ? total + commission.commission : total;
	}, 0);
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Comissões</h1>
	</div>
	<div>
		<Button
			>Filtrar por status<ChevronDownOutline
				class="w-6 h-6 ms-2 text-white dark:text-white"
			/></Button
		>
		<Dropdown>
			<DropdownItem>Comissões Pagas</DropdownItem>
			<DropdownItem>Comissões Pendentes</DropdownItem>
			<DropdownItem>Todas</DropdownItem>
		</Dropdown>
		<Table>
			<TableHead>
				<TableHeadCell>Código do pedido</TableHeadCell>
				<TableHeadCell>Comissão</TableHeadCell>
				<TableHeadCell>Data da compra</TableHeadCell>
				<TableHeadCell>Data de liberação do crédito</TableHeadCell>
				<TableHeadCell>Liberado</TableHeadCell>
				<TableHeadCell>Pago</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each data.commissions as commission}
					<TableBodyRow>
						<TableBodyCell>{commission.order_id}</TableBodyCell>
						<TableBodyCell>{formatCurrency(commission.commission)}</TableBodyCell>
						<TableBodyCell>{formatDate(commission.date_created)}</TableBodyCell>
						<TableBodyCell>{formatDate(commission.release_date)}</TableBodyCell>
						<TableBodyCell>{commission.released ? 'Pago' : 'Pendente'}</TableBodyCell>
						<TableBodyCell>{commission.paid ? 'Pago' : 'Pendente'}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<div class="flex flex-row justify-between">
		<div>
			<Label>Total de crédito à liberar</Label>
			<p>{formatCurrency(totalCommissions)}</p>
			<Label>Total de crédito disponível</Label>
			<p>{formatCurrency(totalReleasedCommissions)}</p>
		</div>
		<div>
			<Button
				>Solicitar créditos<CashSolid class="w-6 h-6 ms-2 text-white dark:text-white" /></Button
			>
		</div>
	</div>
</div>
