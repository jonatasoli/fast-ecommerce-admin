<script lang="ts">
	import CurrencyInput from '@canutin/svelte-currency-input';

	interface $$Props extends Partial<CurrencyInput> {
		label: string;
		error?: string[] | null;
	}

	export let label = 'Label';
	export let value = 0;
	export let error: string[] | null | undefined = [];
	export let onValueChange = (value: number) => {};
</script>

<div>
	<label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
	<CurrencyInput
	    {onValueChange}
		{...$$restProps}
		currency="BRL"
		locale="pt-BR"
		{value}
		inputClasses={{
			wrapper:
				'border text-gray-900 text-sm rounded-lg focus-within:border-primary block w-full p-2.5 outline-none',
			formatted: ' text-gray-700 outline-none w-full',
			formattedPositive: 'text-black'
		}}
	/>
	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>
