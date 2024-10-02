<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';
	import { Button, Input, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Items {
		selectedCode: string;
		base_url: string;
		token_access: string;
	}

	interface NotificationSettings {
		provider: string;
		value: {
			api_key: string;
			contact: string;
			secret_key: string;
			type: string;
		};
		locale: string;
		description: string;
		is_default: boolean;
		settings_id: number;
		field: string;
		is_active: boolean;
	}

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
	export let field: string = 'NOTIFICATION';
	let isLoading = true;
	const settings = settingsStore();

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

	async function getSettings(field: string) {
		try {
			const res = await settings.get(
				`${items.base_url}/settings/?locale=${items.selectedCode}&field=${field}`,
				items.token_access
			);

			if (res) {
				isLoading = false;
				notification = res;
			} else {
				notification = clearFieldsNotification();
				isLoading = false;
				console.warn(
					'Nenhuma configuração de logística encontrada para o locale e field especificados.'
				);
			}
		} catch (error) {
			console.error('Erro ao buscar as configurações de logística:', error);
		}
	}

	const notificationTypes = [
		{ name: 'Email', value: 'Email' },
		{ name: 'Whatsapp', value: 'Whatsapp' },
		{ name: 'SMS', value: 'Sms' }
	];

	function handleSaveNotification() {
		console.log('Configurações de notificação salvas:', notification);
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
</div>
