<script lang="ts">
	import { Tabs, TabItem, Select, Checkbox } from 'flowbite-svelte';
	import PaymentTab from '$lib/components/settings/tabs/payment/+page.svelte';
	import LogisticsTab from '$lib/components/settings/tabs/logistics/+page.svelte';
	import NotificationTab from '$lib/components/settings/tabs/notification/+page.svelte';
	import CdnTab from '$lib/components/settings/tabs/cdn/+page.svelte';
	import CrmTab from '$lib/components/settings/tabs/crm/+page.svelte';
	import GeraisTab from '$lib/components/settings/tabs/gerais/+page.svelte';

	interface selectedLogistics {
		provider: string;
		value: string;
		locale: string;
		description: string;
		is_default: boolean;
		settings_id: number;
		field: string;
		is_active: boolean;
	}

	interface Items {
		selectedCode: string;
		base_url: string;
		token_access: string;
	}

	export let data;

	let selectedCode: string = 'pt-br';

	let items: Items = {
		selectedCode,
		base_url: data.base_url,
		token_access: data.access_token
	};

	let locales = [
		{ name: 'Inglês (Estados Unidos)', value: 'en-US', isDefault: false },
		{ name: 'Inglês (Reino Unido)', value: 'en-GB', isDefault: false },
		{ name: 'Português (Brasil)', value: 'pt-br', isDefault: true },
		{ name: 'Português (Portugal)', value: 'pt-PT', isDefault: false },
		{ name: 'Espanhol (Espanha)', value: 'es-ES', isDefault: false },
		{ name: 'Espanhol (México)', value: 'es-MX', isDefault: false },
		{ name: 'Francês (França)', value: 'fr-FR', isDefault: false },
		{ name: 'Francês (Canadá)', value: 'fr-CA', isDefault: false },
		{ name: 'Alemão (Alemanha)', value: 'de-DE', isDefault: false },
		{ name: 'Italiano (Itália)', value: 'it-IT', isDefault: false },
		{ name: 'Japonês (Japão)', value: 'ja-JP', isDefault: false },
		{ name: 'Chinês Simplificado (China)', value: 'zh-CN', isDefault: false },
		{ name: 'Chinês Tradicional (Taiwan)', value: 'zh-TW', isDefault: false },
		{ name: 'Russo (Rússia)', value: 'ru-RU', isDefault: false },
		{ name: 'Coreano (Coreia do Sul)', value: 'ko-KR', isDefault: false },
		{ name: 'Árabe (Arábia Saudita)', value: 'ar-SA', isDefault: false },
		{ name: 'Holandês (Países Baixos)', value: 'nl-NL', isDefault: false },
		{ name: 'Sueco (Suécia)', value: 'sv-SE', isDefault: false },
		{ name: 'Norueguês (Noruega)', value: 'no-NO', isDefault: false },
		{ name: 'Finlandês (Finlândia)', value: 'fi-FI', isDefault: false }
	];

	function isDefaultCode(code: string) {
		return locales.find((locale) => locale.value === code)?.isDefault ?? false;
	}

	function handleSaveLocales() {
		console.log('Saved locales:', locales);
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
			/>

			<label class="block text-sm font-medium text-gray-700">Padrão:</label>
			<Checkbox checked={isDefaultCode(selectedCode)} />
		</div>
	</form>
</div>

<Tabs contentClass="p-4 rounded-lg dark:bg-gray-800 h-full flex flex-col bg-gray-50">
	<TabItem open title="Pagamento">
		<PaymentTab />
	</TabItem>
	<TabItem title="Logistica">
		<LogisticsTab {items} />
	</TabItem>
	<TabItem title="Notificação">
		<NotificationTab />
	</TabItem>
	<TabItem title="CDN">
		<CdnTab />
	</TabItem>
	<TabItem title="CRM">
		<CrmTab />
	</TabItem>

	<TabItem title="Gerais">
		<GeraisTab />
	</TabItem>
</Tabs>
