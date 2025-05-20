<script lang="ts">
	import Notification from '$lib/components/notification/notification.svelte';
	import { settingsStore } from '$lib/stores/settings';
	import type { Items, NotificationSettings } from '$lib/types';
	import { Button, Input, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let notification: NotificationSettings = {
		provider: '',
		value: {
			api_key: '',
			contact: '',
			secret_key: '',
			type: ''
		},
		locale: '',
		description: '',
		is_default: false,
		settings_id: 0,
		field: '',
		is_active: false
	};

	$: if (items.selectedCode) {
		getSettings(field);
	}

	export let items: Items;
	export let field: string = 'Notification';
	let isLoading = true;
	let statusToast = false;
	let statusMessage = 'Default Message';
	let typeToast = 'success';
	const settings = settingsStore();

	function valuesObject(values: string) {
		try {
			const parsedValues = JSON.parse(values);
			notification.value = {
				type: parsedValues.type || '',
				contact: parsedValues.contact || '',
				api_key: parsedValues.api_key || '',
				secret_key: parsedValues.secret_key || ''
			};
		} catch (error) {
			console.error('Error parsing logistics values JSON.', error);
		}
	}

	function clearFieldsNotification(): NotificationSettings {
		return {
			provider: '',
			value: {
				api_key: '',
				contact: '',
				secret_key: '',
				type: ''
			},
			locale: '',
			description: '',
			is_default: false,
			settings_id: 0,
			field: '',
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

	async function getSettings(field: string) {
		try {
			const res = await settings.get(
				`${items.base_url}/settings/?locale=${items.selectedCode}&field=${field}`,
				items.token_access
			);

			if (res) {
				isLoading = false;
				notification = res;

				if (typeof notification.value === 'string') {
					valuesObject(notification.value);
				}
			} else {
				notification = clearFieldsNotification();
				isLoading = false;
				console.warn('No logistics configuration found for the specified locale and field.');
			}
		} catch (error) {
			console.error('Error fetching logistics settings.', error);
		}
	}

	const notificationTypes = [
		{ name: 'Email', value: 'Email' },
		{ name: 'Whatsapp', value: 'Whatsapp' },
		{ name: 'SMS', value: 'Sms' }
	];

	async function handleSaveNotification() {
		const data = {
			is_default: notification.is_default,
			locale: notification.locale,
			crm: null,
			notification: {
				provider: notification.provider,
				field: 'Notification',
				description: notification.description,
				type: notification.value.type,
				contact: notification.value.contact,
				api_key: notification.value.api_key,
				secret_key: notification.value.secret_key
			},
			payment: null,
			logistics: null,
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
				handleNotification('Success Update!', 'success');
				isLoading = false;
				notification = {
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

	function isEmail() {
		return notification.value.type === 'Email';
	}

	function isPhone() {
		return notification.value.type === 'Whatsapp' || notification.value.type === 'SMS';
	}

	onMount(async () => {
		await getSettings(field);
	});
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de Notificação</h2>

	{#if isLoading}
		<div class="flex justify-center items-center">
			<Spinner size="10" />
		</div>
	{:else}
		<form on:submit|preventDefault={handleSaveNotification}>
			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Notificação:</label>
				<Select bind:value={notification.value.type} items={notificationTypes} />
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>{isEmail() ? 'Email de Origem:' : 'Telefone de Origem:'}</label
				>
				<Input
					type={isEmail() ? 'email' : 'text'}
					bind:value={notification.value.contact}
					placeholder={isEmail() ? 'Digite o e-mail de origem' : 'Digite o telefone de origem'}
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Provider:</label>
				<Input
					type="text"
					bind:value={notification.provider}
					placeholder="Digite a API Key"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">API Key:</label>
				<Input
					type="text"
					bind:value={notification.value.api_key}
					placeholder="Digite a API Key"
					class="input w-full"
				/>
			</div>

			<div class="my-2">
				<label class="block text-sm font-medium text-gray-700 mb-1">Secret Key:</label>
				<Input
					type="password"
					bind:value={notification.value.secret_key}
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
