<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';
	import { Button, Input, Select, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	interface Items {
		selectedCode: string;
		base_url: string;
		token_access: string;
	}

	interface PaymentGatewayConfig {
		provider: string;
		value: {
			gateway_name: string;
			gateway_url: string;
			gateway_key: string;
			gateway_secret_key: string;
		};
		locale: string;
		description: string;
		is_default: boolean;
		settings_id: number;
		field: string;
		is_active: boolean;
	}

	export let items: Items;
	export let field: string = 'PAYMENT';
	let isLoading = true;

	const settings = settingsStore();

	let paymentGateway: PaymentGatewayConfig = {
		provider: '',
		value: {
			gateway_name: '',
			gateway_url: '',
			gateway_key: '',
			gateway_secret_key: ''
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

	function clearFieldsPayments(): PaymentGatewayConfig {
		return {
			provider: '',
			value: {
				gateway_name: '',
				gateway_url: '',
				gateway_key: '',
				gateway_secret_key: ''
			},
			locale: '',
			description: '',
			is_default: false,
			settings_id: 0,
			field: '',
			is_active: false
		};
	}

	function handleSavePaymentGateway() {
		console.log('Saved payment gateway:', paymentGateway);
	}

	function valuesObject(values: string) {
		try {
			const parsedValues = JSON.parse(values);
			paymentGateway.value = {
				gateway_name: parsedValues.gateway_name || '',
				gateway_url: parsedValues.gateway_url || '',
				gateway_key: parsedValues.gateway_key || '',
				gateway_secret_key: parsedValues.gateway_secret_key || ''
			};
		} catch (error) {
			console.error('Erro ao fazer o parse do JSON de valores de logística:', error);
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
				paymentGateway = res;

				if (typeof paymentGateway.value === 'string') {
					valuesObject(paymentGateway.value);
				}
			} else {
				paymentGateway = clearFieldsPayments();
				isLoading = false;
				console.warn(
					'Nenhuma configuração de logística encontrada para o locale e field especificados.'
				);
			}
		} catch (error) {
			console.error('Erro ao buscar as configurações de logística:', error);
		}
	}

	onMount(async () => {
		await getSettings(field);
	});
</script>

<div class="container mt-8 space-y-8">
	<div>
		<h2 class="text-2xl font-bold mb-4">Configuração do Gateway de Pagamento</h2>

		{#if isLoading}
			<div class="flex justify-center items-center">
				<Spinner size="10" />
			</div>
		{:else}
			<form on:submit|preventDefault={handleSavePaymentGateway} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Nome do Gateway:</label>

					<Select
						bind:value={paymentGateway.value.gateway_name}
						items={[
							{ value: 'Mercado Pago', name: 'Mercado Pago' },
							{ value: 'Stripe', name: 'Stripe' },
							{ value: 'Pagarme', name: 'Pagarme' },
							{ value: 'Cielo', name: 'Cielo' }
						]}
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">URL do Gateway:</label>
					<Input
						type="text"
						bind:value={paymentGateway.value.gateway_url}
						placeholder="URL da API"
						class="input border rounded-md px-3 py-2 w-full"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Chave:</label>
					<Input
						type="text"
						bind:value={paymentGateway.value.gateway_key}
						placeholder="Chave API"
						class="input border rounded-md px-3 py-2 w-full"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Chave Secreta:</label>
					<Input
						type="text"
						bind:value={paymentGateway.value.gateway_secret_key}
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
		{/if}
	</div>
</div>
