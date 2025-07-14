<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { _ } from 'svelte-i18n';
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
		<h1 class="text-3xl font-semibold">{$_('PartnerCommissionsPage.Commissions')}</h1>
	</div>
	<div>
		<Button
			>{$_('PartnerCommissionsPage.FilterByStatus')}<ChevronDownOutline
				class="w-6 h-6 ms-2 text-white dark:text-white"
			/></Button
		>
		<Dropdown>
			<DropdownItem>{$_('PartnerCommissionsPage.PaidCommissions')}</DropdownItem>
			<DropdownItem>{$_('PartnerCommissionsPage.PendingCommissions')}</DropdownItem>
			<DropdownItem>{$_('PartnerCommissionsPage.All')}</DropdownItem>
		</Dropdown>
		<Table>
			<TableHead>
				<TableHeadCell>{$_('PartnerCommissionsPage.OrderCode')}</TableHeadCell>
				<TableHeadCell>{$_('PartnerCommissionsPage.Commission')}</TableHeadCell>
				<TableHeadCell>{$_('PartnerCommissionsPage.PurchaseDate')}</TableHeadCell>
				<TableHeadCell>{$_('PartnerCommissionsPage.CreditReleaseDate')}</TableHeadCell>
				<TableHeadCell>{$_('PartnerCommissionsPage.Released')}</TableHeadCell>
				<TableHeadCell>{$_('PartnerCommissionsPage.Paid')}</TableHeadCell>
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
			<Label>{$_('PartnerCommissionsPage.TotalCreditToRelease')}</Label>
			<p>{formatCurrency(totalCommissions)}</p>
			<Label>Total de crédito disponível</Label>
			<p>{formatCurrency(totalReleasedCommissions)}</p>
		</div>
		<div>
			<Button
				>{$_('PartnerCommissionsPage.RequestCredits')}<CashSolid
					class="w-6 h-6 ms-2 text-white dark:text-white"
				/></Button
			>
		</div>
	</div>
</div>
