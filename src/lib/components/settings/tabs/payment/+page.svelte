<script lang="ts">
	import { Button, Input, Select } from 'flowbite-svelte';

	let selectedGateway = 'mercado_pago';

	let paymentGateway = {
		name: '',
		url: '',
		key: '',
		secretKey: ''
	};

	function handleSavePaymentGateway() {
		console.log('Saved payment gateway:', paymentGateway);
	}
</script>

<div class="container mt-8 space-y-8">
	<div>
		<h2 class="text-2xl font-bold mb-4">Configuração do Gateway de Pagamento</h2>
		<form on:submit|preventDefault={handleSavePaymentGateway} class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Nome do Gateway:</label>

				<Select
					bind:value={selectedGateway}
					items={[
						{ value: 'mercado_pago', name: 'Mercado Pago' },
						{ value: 'stripe', name: 'Stripe' },
						{ value: 'pagarme', name: 'Pagarme' },
						{ value: 'cielo', name: 'Cielo' }
					]}
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">URL do Gateway:</label>
				<Input
					type="text"
					bind:value={paymentGateway.url}
					placeholder="URL da API"
					class="input border rounded-md px-3 py-2 w-full"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Chave:</label>
				<Input
					type="text"
					bind:value={paymentGateway.key}
					placeholder="Chave API"
					class="input border rounded-md px-3 py-2 w-full"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Chave Secreta:</label>
				<Input
					type="text"
					bind:value={paymentGateway.secretKey}
					placeholder="Chave Secreta"
					class="input border rounded-md px-3 py-2 w-full"
				/>
			</div>

			<div class="flex justify-end">
				<Button type="submit" class="btn-primary text-white rounded-md px-4 py-2 mt-4"
					>Salvar Configurações</Button
				>
			</div>
		</form>
	</div>
</div>
