<script lang="ts">
	import { Button, Input, Select } from 'flowbite-svelte';
	let cdnConfig = {
		provider: 'S3',
		url: '',
		region: '',
		bucketName: '',
		apiKey: '',
		secretKey: ''
	};

	const cdnProviders = [{ name: 'S3', value: 'S3' }];

	function handleSaveCdnConfig() {
		console.log('Configurações de CDN salvas:', cdnConfig);
	}
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configuração de CDN</h2>
	<form on:submit|preventDefault={handleSaveCdnConfig}>
		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Fornecedor:</label>
			<Select bind:value={cdnConfig.provider} items={cdnProviders} />
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Endereço do CDN (URL):</label>
			<Input
				type="text"
				bind:value={cdnConfig.url}
				placeholder="Digite a URL do CDN"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Região:</label>
			<Input
				type="text"
				bind:value={cdnConfig.region}
				placeholder="Digite a Região"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Nome do Bucket:</label>
			<Input
				type="text"
				bind:value={cdnConfig.bucketName}
				placeholder="Digite o Nome do Bucket"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">API Key:</label>
			<Input
				type="text"
				bind:value={cdnConfig.apiKey}
				placeholder="Digite a API Key"
				class="input w-full"
			/>
		</div>

		<div class="my-2">
			<label class="block text-sm font-medium text-gray-700 mb-1">Secret Key:</label>
			<Input
				type="password"
				bind:value={cdnConfig.secretKey}
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
