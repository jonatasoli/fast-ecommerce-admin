<script lang="ts">
	import { Label, Select } from 'flowbite-svelte';

	interface OptionType {
		value: string | number;
		name: string;
	}

	interface $$Props extends Omit<Partial<HTMLSelectElement>, 'value'> {
		label: string;
		error?: string[] | null;
		items: OptionType[];
		value?: string | number | undefined;
	}

	export let label = 'Label';
	export let error: string[] | null | undefined = [];
	export let items: OptionType[] = [];
</script>

<div>
	<Label class="mb-2">{label}</Label>
	<Select {items} placeholder="Escolha uma opção" />
	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>
