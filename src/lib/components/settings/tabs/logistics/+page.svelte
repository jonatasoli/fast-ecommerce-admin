<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';
	import { Input, Select, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Items {
		selectedCode: string;
		base_url: string;
		token_access: string;
	}

	let logistics = {
		provider: 'Correios',
		description: '',
		is_active: false,
		is_default: false,
		settings_id: 0,
		field: 'LOGISTICS',
		value: {
			logistics_user: '',
			logistics_pass: '',
			logistics_api_secret: '',
			logistics_postal_card: '',
			zip_origin: ''
		}
	};

	$: {
		logistics.provider = logistics.provider.toLowerCase();
	}

	export let items: Items;
	export let field: string = 'LOGISTICS';
	const settings = settingsStore();

	// Função para buscar as configurações
	async function getSettings(field: string) {
		try {
			const res = await settings.get(
				`${items.base_url}/settings/?locale=${items.selectedCode}&field=${field}`,
				items.token_access
			);

			if (res) {
				logistics = res;

				if (typeof logistics.value === 'string') {
					valuesObject(logistics.value);
				}
			} else {
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
			logistics.value = {
				logistics_user: parsedValues.logistics_user || '',
				logistics_pass: parsedValues.logistics_pass || '',
				logistics_api_secret: parsedValues.logistics_api_secret || '',
				logistics_postal_card: parsedValues.logistics_postal_card || '',
				zip_origin: parsedValues.zip_origin || ''
			};
		} catch (error) {
			console.error('Erro ao fazer o parse do JSON de valores de logística:', error);
		}
	}

	function handleSaveLogistics() {
		console.log('Configurações de logística salvas:', logistics);
	}

	const providers = [
		{ name: 'Correios', value: 'correios' },
		{ name: 'DHL', value: 'dhl' }
	];

	onMount(async () => {
		await getSettings(field);
	});
</script>

<!-- Interface de usuário para exibir os valores -->
<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de Logística</h2>
	<form on:submit|preventDefault={handleSaveLogistics}>
		<!-- Nome do Fornecedor -->
		<div class="my-2">
			<label for="provider" class="block text-sm font-medium text-gray-700 mb-1"
				>Nome do Fornecedor:</label
			>
			<Select id="provider" bind:value={logistics.provider} items={providers} class="mt-1 w-full" />
		</div>

		<!-- Usuário -->
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Usuário:</label>
			<Input
				type="text"
				bind:value={logistics.value.logistics_user}
				placeholder="Usuário"
				class="input w-full"
			/>
		</div>

		<!-- Senha -->
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Senha:</label>
			<Input
				type="password"
				bind:value={logistics.value.logistics_pass}
				placeholder="Senha"
				class="input w-full"
			/>
		</div>

		<!-- API Secret -->
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">API Secret:</label>
			<Input
				type="text"
				bind:value={logistics.value.logistics_api_secret}
				placeholder="API Secret"
				class="input w-full"
			/>
		</div>

		<!-- Cartão Postal -->
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Postal Card:</label>
			<Input
				type="text"
				bind:value={logistics.value.logistics_postal_card}
				placeholder="API Secret"
				class="input w-full"
			/>
		</div>
		<div class="flex justify-end">
			<Button type="submit" class="btn-primary text-white rounded-md px-4 py-2 mt-4"
				>Salvar Configurações</Button
			>
		</div>
	</form>
</div>
