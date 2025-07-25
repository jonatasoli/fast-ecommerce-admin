<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';
	import { Input, Select, Button, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Notification from '$lib/components/notification/notification.svelte';
	import type { Items, LogisticsConfig } from '$lib/types';
	import { _ } from 'svelte-i18n';
	let logistics: LogisticsConfig = {
		provider: '',
		description: '',
		locale: '',
		is_active: false,
		is_default: false,
		settings_id: 0,
		field: '',
		value: {
			name: '',
			logistics_user: '',
			logistics_pass: '',
			logistics_api_secret: '',
			logistics_postal_card: '',
			zip_origin: ''
		}
	};

	function clearFieldsLogistics(): LogisticsConfig {
		return {
			provider: '',
			description: '',
			locale: '',
			is_active: false,
			is_default: false,
			settings_id: 0,
			field: '',
			value: {
				name: '',
				logistics_user: '',
				logistics_pass: '',
				logistics_api_secret: '',
				logistics_postal_card: '',
				zip_origin: ''
			}
		};
	}

	$: if (items.selectedCode) {
		getSettings(field);
	}

	export let items: Items;
	export let field: string = 'LOGISTICS';
	let isLoading = true;
	let statusToast = false;
	let statusMessage = 'Default Message';
	let typeToast = 'success';
	const settings = settingsStore();

	async function getSettings(field: string) {
		try {
			const res = await settings.get(
				`${items.base_url}/settings/?locale=${items.selectedCode}&field=${field}`,
				items.token_access
			);

			if (res) {
				isLoading = false;
				logistics = res;

				if (typeof logistics.value === 'string') {
					valuesObject(logistics.value);
				}
			} else {
				logistics = clearFieldsLogistics();
				isLoading = false;
				console.warn('No logistics configuration found for the specified locale and field.');
			}
		} catch (error) {
			console.error('Error fetching logistics settings.', error);
		}
	}

	function valuesObject(values: string) {
		try {
			const parsedValues = JSON.parse(values);
			logistics.value = {
				name: parsedValues.name || '',
				logistics_user: parsedValues.logistics_user || '',
				logistics_pass: parsedValues.logistics_pass || '',
				logistics_api_secret: parsedValues.logistics_api_secret || '',
				logistics_postal_card: parsedValues.logistics_postal_card || '',
				zip_origin: parsedValues.zip_origin || ''
			};
		} catch (error) {
			console.error('Error parsing logistics values JSON.', error);
		}
	}

	function handleSaveNotification(res: string, type: string) {
		statusMessage = res;
		typeToast = type;
		statusToast = true;

		setTimeout(() => {
			statusToast = false;
		}, 3000);
	}

	const providers = [
		{ name: 'Correios', value: 'Correios' },
		{ name: 'DHL', value: 'Dhl' }
	];

	async function handleSaveLogistics() {
		const data = {
			is_default: logistics.is_default,
			locale: logistics.locale,
			crm: null,
			logistics: {
				provider: logistics.provider,
				field: 'LOGISTICS',
				description: logistics.description,
				name: logistics.value.name,
				logistics_user: logistics.value.logistics_user,
				logistics_pass: logistics.value.logistics_pass,
				logistics_api_secret: logistics.value.logistics_api_secret,
				logistics_postal_card: logistics.value.logistics_postal_card,
				zip_origin: logistics.value.zip_origin
			},
			payment: null,
			notification: null,
			cdn: null,
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
				handleSaveNotification('Success Update!', 'success');
				isLoading = false;
				logistics = {
					provider: res.provider,
					value: JSON.parse(res.value), // Faz o parsing da string JSON
					locale: res.locale,
					description: res.description,
					is_default: res.is_default,
					settings_id: res.settings_id,
					field: res.field,
					is_active: res.is_active
				};
			}
		} catch (error) {
			handleSaveNotification('Error in update', 'error');
			isLoading = false;
			console.error('Error fetching logistics settings.', error);
		}
	}

	onMount(async () => {
		await getSettings(field);
	});
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">{$_('LogisticsSettings.LogisticsSettings')}</h2>
	{#if isLoading}
		<div class="flex justify-center items-center">
			<Spinner size="10" />
		</div>
	{:else}
		<form on:submit|preventDefault={handleSaveLogistics}>
			<div class="my-2">
				<label for="provider" class="block text-sm font-medium text-gray-700 mb-1"
					>{$_('LogisticsSettings.SupplierName')}:</label
				>
				<Select
					id="provider"
					bind:value={logistics.provider}
					items={providers}
					class="mt-1 w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>{$_('LogisticsSettings.User')}:</label
				>
				<Input
					type="text"
					bind:value={logistics.value.logistics_user}
					placeholder="Usuário"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>{$_('LogisticsSettings.Password')}:</label
				>
				<Input
					type="password"
					bind:value={logistics.value.logistics_pass}
					placeholder="Senha"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>{$_('LogisticsSettings.ApiSecret')}:</label
				>
				<Input
					type="text"
					bind:value={logistics.value.logistics_api_secret}
					placeholder="API Secret"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>{$_('LogisticsSettings.PostalCard')}:</label
				>
				<Input
					type="text"
					bind:value={logistics.value.logistics_postal_card}
					placeholder="API Secret"
					class="input w-full"
				/>
			</div>
			<div class="flex justify-end">
				<Button type="submit" class="btn-primary text-white rounded-md px-4 py-2 mt-4"
					>{$_('LogisticsSettings.SaveSettings')}</Button
				>
			</div>
		</form>
	{/if}
	{#if statusToast}
		<Notification message={statusMessage} {statusToast} type={typeToast} />
	{/if}
</div>
