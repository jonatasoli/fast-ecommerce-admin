<script>
	import { Toast } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';

        const DEFAULT_MESSAGE = 'Default Message'
        
	export let message = DEFAULT_MESSAGE
	export let statusExibitionToast = false;
	export let type = 'success';
</script>

<div class="flex gap-10">
	{#if type === 'success'}
		<Toast transition={slide} bind:statusToast color="green" position="top-right">
			<CheckCircleSolid slot="icon" class="w-5 h-5" />
			{message}
		</Toast>
	{/if}
	{#if type === 'error'}
		<Toast transition={slide} bind:statusToast color="red" position="top-right">
			<CloseCircleSolid slot="icon" class="w-5 h-5" />
			{message}
		</Toast>
	{/if}
</div>
