<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';
	import { Button, Input, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Items {
		selectedCode: string;
		base_url: string;
		token_access: string;
	}

	interface CdnConfig {
		provider: string;
		value: {
			url: string;
			region: string;
			bucket_name: string;
			api_key: string;
			secret_key: string;
		};
		locale: string;
		description: string;
		is_default: boolean;
		field: string;
		settings_id: number;
		is_active: boolean;
	}
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
	const settings = settingsStore();

	const cdnProviders = [{ name: 'S3', value: 'S3' }];

	function handleSaveCdnConfig() {
		console.log('Configurações de CDN salvas:', cdnConfig);
	}

	function clearFieldsCdn(): CdnConfig {
		return {
			provider: '', // Define o provider como 'S3'
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
			console.error('Erro ao fazer o parse do JSON de valores de logística:', error);
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
				console.warn(
					'Nenhuma configuração de logística encontrada para o locale e field especificados.'
				);
			}
		} catch (error) {
			console.error('Erro ao buscar as configurações de logística:', error);
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
</div>
