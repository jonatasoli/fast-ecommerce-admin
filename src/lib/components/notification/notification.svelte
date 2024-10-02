<script>
	import { Toast } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';

	export let message = 'Default message'; // Mensagem padrão
	export let statusToast = false; // Controla a exibição do Toast
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
