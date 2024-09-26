<script lang="ts">
	import { Input, Button } from 'flowbite-svelte';

	let generalConfig = {
		companyName: ''
	};

	function handleSaveGeneralConfig() {
		console.log('Configurações gerais salvas:', generalConfig);
	}
</script>

<div class="container mt-8 space-y-8">
	<h2 class="text-2xl font-bold mb-4">Configurações Gerais</h2>
	<form on:submit|preventDefault={handleSaveGeneralConfig}>
		<div class="my-4">
			<label class="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa:</label>
			<Input
				type="text"
				bind:value={generalConfig.companyName}
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
</div>
