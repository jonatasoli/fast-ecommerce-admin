<script lang="ts">
	import Notification from '$lib/components/notification/notification.svelte';
	import { settingsStore } from '$lib/stores/settings';
	import type { CompanySettings, Items } from '$lib/types';
	import { Input, Button, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let generalConfig: CompanySettings = {
		provider: '',
		value: {
			provider: '',
			field: '',
			description: '',
			name: ''
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
	export let field: string = 'COMPANY';
	let isLoading = true;
	let statusToast = false;
	let statusMessage = 'Default Message';
	let typeToast = 'success';
	const settings = settingsStore();

	function clearFieldsCompany(): CompanySettings {
		return {
			provider: '',
			value: {
				provider: '',
				field: '',
				description: '',
				name: ''
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

	async function handleSaveCompany() {
		const data = {
			is_default: generalConfig.is_default,
			locale: generalConfig.locale,
			company: {
				provider: generalConfig.provider,
				field: 'COMPANY',
				description: generalConfig.description,
				name: generalConfig.value.name
			},
			crm: null,
			notification: null,
			payment: null,
			logistics: null,
			cdn: null
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
				generalConfig = {
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

	function valuesObject(values: string) {
		try {
			const parsedValues = JSON.parse(values);
			generalConfig.value = {
				name: parsedValues.name || '',
				description: parsedValues.description || '',
				field: parsedValues.field || '',
				provider: parsedValues.provider || ''
			};
		} catch (error) {
			console.error('Error parsing logistics values JSON.', error);
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
				generalConfig = res;

				if (typeof generalConfig.value === 'string') {
					valuesObject(generalConfig.value);
				}
			} else {
				generalConfig = clearFieldsCompany();
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
	<h2 class="text-2xl font-bold mb-4">Configurações Gerais</h2>
	{#if isLoading}
		<div class="flex justify-center items-center">
			<Spinner size="10" />
		</div>
	{:else}
		<form on:submit|preventDefault={handleSaveCompany}>
			<div class="my-4">
				<label class="block text-sm font-medium text-gray-700 mb-1">Provider:</label>
				<Input
					type="text"
					bind:value={generalConfig.provider}
					placeholder="Digite o nome da empresa"
					class="input w-full"
				/>
			</div>

			<div class="my-4">
				<label class="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
				<Input
					type="text"
					bind:value={generalConfig.value.description}
					placeholder="Digite o nome da empresa"
					class="input w-full"
				/>
			</div>

			<div class="my-4">
				<label class="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa:</label>
				<Input
					type="text"
					bind:value={generalConfig.value.name}
					placeholder="Digite o nome da empresa"
					class="input w-full"
				/>
			</div>

			<div class="mt-4 text-right">
				<Button type="submit" class="btn-primary text-white rounded-md px-4 py-2">
					Salvar Configurações
				</Button>
			</div>
		</form>
	{/if}
	{#if statusToast}
		<Notification message={statusMessage} {statusToast} type={typeToast} />
	{/if}
</div>
