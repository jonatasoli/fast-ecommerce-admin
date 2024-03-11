<script lang="ts">
	import { tv } from 'tailwind-variants';

	const input = tv({
		base: 'border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5 outline-none',
	});

	type Input = Omit<Partial<HTMLInputElement>, 'max' | 'min' | 'step' | 'value'>;

	interface $$Props extends Partial<Input> {
        label: string
		error?: string[] | null
		max?: string | number
		step?: string | number
		min?: string | number
		value?: string | number
    }
    
    export let label = 'Label';
	export let type = 'text';
	export let value = $$restProps.defaultValue || '';
	export let error: string[] | null | undefined = [];
</script>

<div>
	<label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
	<input class={input()} {type} {value} {...$$restProps} />
	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>
