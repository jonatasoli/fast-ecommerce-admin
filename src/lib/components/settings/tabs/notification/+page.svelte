<script lang="ts">
	import { Button, Input, Select } from 'flowbite-svelte';
	let notification = {
		type: 'email',
		emailOrPhone: '',
		apiKey: '',
		secretKey: ''
	};

	const notificationTypes = [
		{ name: 'Email', value: 'email' },
		{ name: 'Whatsapp', value: 'whatsapp' },
		{ name: 'SMS', value: 'sms' }
	];

	function handleSaveNotification() {
		console.log('Configurações de notificação salvas:', notification);
	}

	function isEmail() {
		return notification.type === 'Email';
	}

	function isPhone() {
		return notification.type === 'Whatsapp' || notification.type === 'SMS';
	}
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de Notificação</h2>
	<form on:submit|preventDefault={handleSaveNotification}>
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Notificação:</label>
			<Select bind:value={notification.type} items={notificationTypes} />
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1"
				>{isEmail() ? 'Email de Origem:' : 'Telefone de Origem:'}</label
			>
			<Input
				type={isEmail() ? 'email' : 'text'}
				bind:value={notification.emailOrPhone}
				placeholder={isEmail() ? 'Digite o e-mail de origem' : 'Digite o telefone de origem'}
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">API Key:</label>
			<Input
				type="text"
				bind:value={notification.apiKey}
				placeholder="Digite a API Key"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Secret Key:</label>
			<Input
				type="password"
				bind:value={notification.secretKey}
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
</div>
