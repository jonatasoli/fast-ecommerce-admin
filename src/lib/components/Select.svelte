<script lang="ts">
	import { tv } from 'tailwind-variants';

	const select = tv({
		base: 'border text-gray-900 bg-white text-sm rounded-lg focus:ring-blue-500 focus:border-primary block w-full p-2.5 outline-none',
	});

	interface $$Props extends Partial<HTMLSelectElement> {
        label: string
		error?: string[] | null
    }
    
    export let label = 'Label';
	export let value = $$restProps.defaultValue || '';
	export let error: string[] | null | undefined = [];
</script>

<div>
	<label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
    <select class={select()} {...$$restProps} {value}>
        <option value="">Selecione</option>
        <slot></slot>
    </select>
	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>
