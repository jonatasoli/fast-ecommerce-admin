<script lang="ts">
	import { Input, Select, Button } from 'flowbite-svelte';
	let logistics = {
		provider: 'correios',
		logistics_user: '',
		logistics_pass: '',
		logistics_api_secret: '',
		logistics_postal_card: '',
		zip_origin: ''
	};

	function handleSaveLogistics() {
		console.log('Configurações de logística salvas:', logistics);
	}

	const providers = [
		{ name: 'Correios', value: 'correios' },
		{ name: 'DHL', value: 'dhl' }
	];
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de Logística</h2>
	<form on:submit|preventDefault={handleSaveLogistics}>
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Nome do Fornecedor:</label>
			<Select bind:value={logistics.provider} items={providers} />
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Usuário:</label>
			<Input
				type="text"
				bind:value={logistics.logistics_user}
				placeholder="Usuário"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Senha:</label>
			<Input
				type="password"
				bind:value={logistics.logistics_pass}
				placeholder="Senha"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">API Secret:</label>
			<Input
				type="text"
				bind:value={logistics.logistics_api_secret}
				placeholder="API Secret"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Postal Card:</label>
			<Input
				type="text"
				bind:value={logistics.logistics_postal_card}
				placeholder="Postal Card"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">CEP de Origem:</label>
			<Input
				type="text"
				bind:value={logistics.zip_origin}
				placeholder="CEP de Origem"
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
