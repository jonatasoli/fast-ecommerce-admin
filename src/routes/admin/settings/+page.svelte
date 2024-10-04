<script lang="ts">
	import { Tabs, TabItem, Select, Checkbox } from 'flowbite-svelte';
	import PaymentTab from '$lib/components/settings/tabs/payment/+page.svelte';
	import LogisticsTab from '$lib/components/settings/tabs/logistics/+page.svelte';
	import NotificationTab from '$lib/components/settings/tabs/notification/+page.svelte';
	import CdnTab from '$lib/components/settings/tabs/cdn/+page.svelte';
	import CrmTab from '$lib/components/settings/tabs/crm/+page.svelte';
	import GeraisTab from '$lib/components/settings/tabs/general/+page.svelte';
	import type { Items } from '$lib/types.js';
	import { locales } from '$lib/utils.js';

	export let data;

	let selectedCode: string = 'pt-br';

	let items: Items = {
		selectedCode,
		base_url: data.base_url,
		token_access: data.access_token
	};

	function isDefaultCode(code: string) {
		return locales.find((locale) => locale.value === code)?.isDefault ?? false;
	}

	function handleSaveLocales() {
		items.selectedCode = selectedCode;
	}
</script>

<div class="container mt-8 space-y-8 p-4">
	<h2 class="text-2xl font-bold mb-4">Configuração de Locais</h2>
	<form on:submit|preventDefault={handleSaveLocales} class="space-y-4">
		<div class="flex items-center space-x-4">
			<label class="block text-sm font-medium text-gray-700">Locale Code (Short Code):</label>
			<Select
				bind:value={selectedCode}
				variant="outlined"
				noLabel
				class="w-auto"
				placeholder="Escolha uma opção"
				items={locales}
				on:change={handleSaveLocales}
			/>

			<label class="block text-sm font-medium text-gray-700">Padrão:</label>
			<Checkbox checked={isDefaultCode(selectedCode)} />
		</div>
	</form>
</div>

<Tabs contentClass="p-4 rounded-lg dark:bg-gray-800 h-full flex flex-col bg-gray-50">
	<TabItem open title="Pagamento">
		<PaymentTab {items} />
	</TabItem>
	<TabItem title="Logistica">
		<LogisticsTab {items} />
	</TabItem>
	<TabItem title="Notificação">
		<NotificationTab {items} />
	</TabItem>
	<TabItem title="CDN">
		<CdnTab {items} />
	</TabItem>
	<TabItem title="CRM">
		<CrmTab {items} />
	</TabItem>

	<TabItem title="Gerais">
		<GeraisTab {items} />
	</TabItem>
</Tabs>
