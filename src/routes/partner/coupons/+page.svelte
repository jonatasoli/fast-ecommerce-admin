<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { Input, Alert } from 'flowbite-svelte';
	import { FileCopyAltSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher(); // For emitting events to the parent component

	export let data;
	let showAlerts = {};

	async function copyLink(linkValue: string) {
		try {
			await navigator.clipboard.writeText(linkValue);
			showAlerts[linkValue] = true;
			setTimeout(() => {
				showAlerts[linkValue] = false;
			}, 3000); // Hide alert after 3 seconds
			dispatch('linkCopied', linkValue); // Emit an event with the copied link
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}
</script>

<div class="w-[90vw] mt-8 mx-auto">
	<div class="flex justify-between items-center w-full">
		<h1 class="text-3xl font-semibold">Cupons</h1>
	</div>
	<div class="flex justify-center items-center w-full">
		{#each data.links as linkValue}
			<Input type="url" placeholder="Enter Link" bind:value={linkValue} class="w-80" />

			<Button on:click={() => copyLink(linkValue)}>
				<FileCopyAltSolid class="mr-2 h-4 w-4" />
				Copiar Link
			</Button>

			{#if showAlerts[linkValue]}
				<Alert color="green" on:close={() => (showAlerts[linkValue] = false)}>Link copiado!</Alert>
			{/if}
		{/each}
	</div>
</div>
