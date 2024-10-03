<script lang="ts">
	import Notification from '$lib/components/notification/notification.svelte';
	import { settingsStore } from '$lib/stores/settings';
	import { Input, Select, Button, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Items {
		selectedCode: string;
		base_url: string;
		token_access: string;
	}

	interface CrmSettings {
		provider: string;
		value: {
			provider: string;
			field: string;
			description: string;
			access_key: string;
			url: string;
			deal_stage_id: string;
			deal_stage_name: string;
		};
		locale: string;
		description: string;
		is_default: boolean;
		field: string;
		settings_id: number;
		is_active: boolean;
	}

	let crmSettings: CrmSettings = {
		provider: '',
		value: {
			provider: '',
			field: '',
			description: '',
			access_key: '',
			url: '',
			deal_stage_id: '',
			deal_stage_name: ''
		},
		locale: '',
		description: '',
		is_default: false,
		field: '',
		settings_id: 0,
		is_active: false
	};

	$: if (items.selectedCode) {
		getSettings(field);
	}

	export let items: Items;
	export let field: string = 'CRM';
	let isLoading = true;
	let statusToast = false;
	let statusMessage = 'This is a custom message';
	let typeToast = 'success';
	const settings = settingsStore();

	function clearFieldsCrm(): CrmSettings {
		return {
			provider: '',
			value: {
				provider: '',
				field: '',
				description: '',
				access_key: '',
				url: '',
				deal_stage_id: '',
				deal_stage_name: ''
			},
			locale: '',
			description: '',
			is_default: false,
			field: '',
			settings_id: 0,
			is_active: false
		};
	}

	function handleNotification(res: string, type: string) {
		statusMessage = res;
		typeToast = type;
		statusToast = true;

		setTimeout(() => {
			statusToast = false;
		}, 3000);
	}

	async function handleSaveCrmConfig() {
		const data = {
			is_default: crmSettings.is_default,
			locale: crmSettings.locale,
			crm: {
				provider: crmSettings.provider,
				field: 'CRM',
				description: crmSettings.value.description,
				access_key: crmSettings.value.access_key,
				url: crmSettings.value.url,
				deal_stage_id: crmSettings.value.deal_stage_id,
				deal_stage_name: crmSettings.value.deal_stage_name
			},
			cdn: null,
			notification: null,
			payment: null,
			logistics: null,
			company: null
		};

		try {
			isLoading = true;
			const res = await settings.patch(
				`${items.base_url}/settings/?locale=${items.selectedCode}`,
				data,
				items.token_access
			);

			if (res) {
				handleNotification('Success Update!', 'success');
				isLoading = false;
				crmSettings = {
					provider: res.provider,
					value: JSON.parse(res.value),
					locale: res.locale,
					description: res.description,
					is_default: res.is_default,
					settings_id: res.settings_id,
					field: res.field,
					is_active: res.is_active
				};
			}
		} catch (error) {
			handleNotification('Error in update', 'error');
			isLoading = false;
			console.error('Erro ao buscar as configurações de logística:', error);
		}
	}

	async function getSettings(field: string) {
		try {
			const res = await settings.get(
				`${items.base_url}/settings/?locale=${items.selectedCode}&field=${field}`,
				items.token_access
			);

			if (res) {
				isLoading = false;
				crmSettings = res;

				if (typeof crmSettings.value === 'string') {
					valuesObject(crmSettings.value);
				}
			} else {
				crmSettings = clearFieldsCrm();
				isLoading = false;
				console.warn(
					'Nenhuma configuração de logística encontrada para o locale e field especificados.'
				);
			}
		} catch (error) {
			console.error('Erro ao buscar as configurações de logística:', error);
		}
	}

	function valuesObject(values: string) {
		try {
			const parsedValues = JSON.parse(values);
			crmSettings.value = {
				access_key: parsedValues.access_key || '',
				url: parsedValues.url || '',
				deal_stage_id: parsedValues.deal_stage_id || '',
				deal_stage_name: parsedValues.deal_stage_name || '',
				description: parsedValues.description || '',
				provider: parsedValues.provider || '',
				field: parsedValues.field || ''
			};
		} catch (error) {
			console.error('Erro ao fazer o parse do JSON de valores de logística:', error);
		}
	}

	const providers = [{ name: 'Rd Station', value: 'RD Station' }];

	onMount(async () => {
		await getSettings(field);
	});
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de Logística</h2>
	{#if isLoading}
		<div class="flex justify-center items-center">
			<Spinner size="10" />
		</div>
	{:else}
		<form on:submit|preventDefault={handleSaveCrmConfig}>
			<div class="my-2">
				<label for="provider" class="block text-sm font-medium text-gray-700 mb-1"
					>Nome do Fornecedor:</label
				>
				<Select
					id="provider"
					bind:value={crmSettings.provider}
					items={providers}
					class="mt-1 w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
				<Input
					type="text"
					bind:value={crmSettings.value.description}
					placeholder="Usuário"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Access Key:</label>
				<Input
					type="text"
					bind:value={crmSettings.value.access_key}
					placeholder="Senha"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Url:</label>
				<Input
					type="text"
					bind:value={crmSettings.value.url}
					placeholder="URL"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Stage Name:</label>
				<Input
					type="text"
					bind:value={crmSettings.value.deal_stage_name}
					placeholder="Stage Name"
					class="input w-full"
				/>
			</div>
			<div class="flex justify-end">
				<Button type="submit" class="btn-primary text-white rounded-md px-4 py-2 mt-4"
					>Salvar Configurações</Button
				>
			</div>
		</form>
	{/if}
	{#if statusToast}
		<Notification message={statusMessage} {statusToast} type={typeToast} />
	{/if}
</div>
