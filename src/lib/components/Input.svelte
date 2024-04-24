<script lang="ts">
	import { IMask } from '@imask/svelte';
	import { Helper, Input, Label, type InputType } from 'flowbite-svelte';
	import { tv } from 'tailwind-variants';

	type Input = Omit<Partial<HTMLInputElement>, 'max' | 'min' | 'step' | 'value'>;

	interface $$Props extends Partial<Input> {
        label: string
		error?: string[] | null
		max?: string | number
		step?: string | number
		min?: string | number
		value?: string | number
		mask?: string
    }
    
    export let label = 'Label';
	export let value = $$restProps.defaultValue || '';
	export let error: string[] | null | undefined = [];
	export let mask: string | undefined = undefined;

	function applyMask(event: Event) {
		if (mask) {
			const input = event.target as HTMLInputElement;
			const imask = IMask(input, { mask });
			value = imask.unmaskedValue;
		}
	}
</script>

<div class="block space-y-2">
	<Label>{label}</Label>
	<Input {value} {...$$restProps} on:input={applyMask}/>
	{#if error}
		<Helper class="mt-2" color="red">
			{#each error as message}
				<p class="text-sm">{message}</p>
			{/each}
		</Helper>
	{/if}
	</div>