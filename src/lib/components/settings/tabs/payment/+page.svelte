<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { settingsStore } from '$lib/stores/settings';
	import { Button, Input, Select, Spinner, Toast } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Notification from '$lib/components/notification/notification.svelte';
	import type { Items, PaymentGatewayConfig } from '$lib/types';

	export let items: Items;
	export let field: string = 'PAYMENT';
	let isLoading = true;
	let statusToast = false;
	let statusMessage = 'Default Message';
	let typeToast = 'success';

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

	function handleSaveNotification(res: string, type: string) {
		statusMessage = res;
		typeToast = type;
		statusToast = true;

		setTimeout(() => {
			statusToast = false;
		}, 3000);
	}

	async function handleSavePaymentGateway() {
		const data = {
			is_default: paymentGateway.is_default,
			locale: paymentGateway.locale,
			crm: null,
			payment: {
				provider: paymentGateway.provider,
				field: 'PAYMENT',
				description: paymentGateway.description,
				gateway_name: paymentGateway.value.gateway_name,
				gateway_url: paymentGateway.value.gateway_url,
				gateway_key: paymentGateway.value.gateway_key,
				gateway_secret_key: paymentGateway.value.gateway_secret_key
			},
			logistics: null,
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
				paymentGateway = {
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
			handleSaveNotification('Error in update', 'error');
			isLoading = false;
			console.error('Error fetching logistics settings.', error);
		}
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
				paymentGateway = res;

				if (typeof paymentGateway.value === 'string') {
					valuesObject(paymentGateway.value);
				}
			} else {
				paymentGateway = clearFieldsPayments();
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
	<div>
		<h2 class="text-2xl font-bold mb-4">{$_('settings.paymentTab.title')}</h2>

		{#if isLoading}
			<div class="flex justify-center items-center">
				<Spinner size="10" />
			</div>
		{:else}
			<form on:submit|preventDefault={handleSavePaymentGateway} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>{$_('settings.paymentTab.gatewayName')}</label
					>

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
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>{$_('settings.paymentTab.gatewayUrl')}</label
					>
					<Input
						type="text"
						bind:value={paymentGateway.value.gateway_url}
						placeholder={$_('settings.paymentTab.urlApi')}
						class="input border rounded-md px-3 py-2 w-full"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>{$_('settings.paymentTab.key')}</label
					>
					<Input
						type="text"
						bind:value={paymentGateway.value.gateway_key}
						placeholder={$_('settings.paymentTab.apiKey')}
						class="input border rounded-md px-3 py-2 w-full"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1"
						>{$_('settings.paymentTab.secretKey')}</label
					>
					<Input
						type="text"
						bind:value={paymentGateway.value.gateway_secret_key}
						placeholder={$_('settings.paymentTab.secretKey')}
						class="input border rounded-md px-3 py-2 w-full"
					/>
				</div>

				<div class="flex justify-end">
					<Button type="submit" class="btn-primary text-white rounded-md px-4 py-2 mt-4"
						>{$_('settings.paymentTab.save')}</Button
					>
				</div>
			</form>
		{/if}
	</div>
	{#if statusToast}
		<Notification message={statusMessage} {statusToast} type={typeToast} />
	{/if}
</div>
