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
				'text-gray-900 text-sm p-0.5 rounded-lg  block w-full  outline-none',
			formatted: 'text-gray-900 outline-none w-full border border-gray-300 rounded-lg bg-[#F9FAFB] focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:ring-opacity-50',
			formattedPositive: 'text-black'
		}}
	/>
	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>
