<script lang="ts">
	import Notification from '$lib/components/notification/notification.svelte';
	import { settingsStore } from '$lib/stores/settings';
	import type { CdnConfig, Items } from '$lib/types';
	import { Button, Input, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let cdnConfig: CdnConfig = {
		provider: 'S3',
		value: {
			url: '',
			region: '',
			bucket_name: '',
			api_key: '',
			secret_key: ''
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
	export let field: string = 'CDN';
	let isLoading = true;
	let statusToast = false;
	let statusMessage = 'Default Message';
	let typeToast = 'success';
	const settings = settingsStore();

	const cdnProviders = [{ name: 'S3', value: 'S3' }];

	function clearFieldsCdn(): CdnConfig {
		return {
			provider: '',
			value: {
				url: '',
				region: '',
				bucket_name: '',
				api_key: '',
				secret_key: ''
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

	function valuesObject(values: string) {
		try {
			const parsedValues = JSON.parse(values);
			cdnConfig.value = {
				url: parsedValues.url || '',
				region: parsedValues.region || '',
				bucket_name: parsedValues.bucket_name || '',
				api_key: parsedValues.api_key || '',
				secret_key: parsedValues.secret_key || ''
			};
		} catch (error) {
			console.error('Error parsing logistics values JSON', error);
		}
	}

	async function handleSaveCdnConfig() {
		const data = {
			is_default: cdnConfig.is_default,
			locale: cdnConfig.locale,
			cdn: {
				provider: cdnConfig.provider,
				field: 'CDN',
				description: cdnConfig.description,
				url: cdnConfig.value.url,
				region: cdnConfig.value.region,
				bucket_name: cdnConfig.value.bucket_name,
				api_key: cdnConfig.value.api_key,
				secret_key: cdnConfig.value.secret_key
			},
			crm: null,
			notification: null,
			payment: null,
			logistics: null,
			company: null
		};

		try {
			isLoading = true;
			const res = await settings.patch(

				`${items.base_url}/settings?locale=${items.selectedCode}`,
        data,
				items.token_access
			);

			if (res) {
				handleNotification('Success Update!', 'success');
				isLoading = false;
				cdnConfig = {
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
			console.error('Error fetching logistics settings.', error);
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
				cdnConfig = res;

				if (typeof cdnConfig.value === 'string') {
					valuesObject(cdnConfig.value);
				}
			} else {
				cdnConfig = clearFieldsCdn();
				isLoading = false;
				console.warn('No logistics configuration found for the specified locale and field.');
			}
		} catch (error) {
			console.error('Error fetching logistics settings.', error);
		}
	}

	onMount(async () => {
		await getSettings(field);
	});
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de CDN</h2>
	{#if isLoading}
		<div class="flex justify-center items-center">
			<Spinner size="10" />
		</div>
	{:else}
		<form on:submit|preventDefault={handleSaveCdnConfig}>
			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Fornecedor:</label>
				<Select bind:value={cdnConfig.provider} items={cdnProviders} />
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Endereço do CDN (URL):</label>
				<Input
					type="text"
					bind:value={cdnConfig.value.url}
					placeholder="Digite a URL do CDN"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Região:</label>
				<Input
					type="text"
					bind:value={cdnConfig.value.region}
					placeholder="Digite a Região"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Nome do Bucket:</label>
				<Input
					type="text"
					bind:value={cdnConfig.value.bucket_name}
					placeholder="Digite o Nome do Bucket"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">API Key:</label>
				<Input
					type="text"
					bind:value={cdnConfig.value.api_key}
					placeholder="Digite a API Key"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Secret Key:</label>
				<Input
					type="password"
					bind:value={cdnConfig.value.secret_key}
					placeholder="Digite a Secret Key"
					class="input w-full"
				/>
			</div>

			<div class="mt-4 text-right">
				<Button type="submit" class="btn-primary  text-white rounded-md px-4 py-2">
					Salvar Configurações
				</Button>
			</div>
		</form>
	{/if}
	{#if statusToast}
		<Notification message={statusMessage} {statusToast} type={typeToast} />
	{/if}
</div>
