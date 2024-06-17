<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { notifications } from '$lib/notifications';
	import { CheckPlusCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	export let themes: Record<
		string,
		| 'red'
		| 'green'
		| 'orange'
		| 'blue'
		| 'none'
		| 'gray'
		| 'yellow'
		| 'indigo'
		| 'purple'
		| 'primary'
		| undefined
	> = {
		danger: 'red',
		success: 'green',
		warning: 'orange',
		info: 'blue',
		default: 'none'
	};

	export let icons: Record<string, ConstructorOfATypedSvelteComponent> = {
		danger: ExclamationCircleSolid,
		success: CheckPlusCircleSolid,
		warning: ExclamationCircleSolid,
		info: ExclamationCircleSolid
	};
</script>

<div
	class="fixed top-3 left-0 right-0 mx-auto p-0 z-[9999] flex flex-col justify-start items-center pointer-events-none"
>
	{#each $notifications as notification (notification.id)}
		<Toast
			color={themes[notification.type]}
			divClass="w-full p-6 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 gap-3"
		>
			<svelte:fragment slot="icon">
				<svelte:component this={icons[notification.type]} class="w-8 h-8" />
			</svelte:fragment>
			<p class="text-xl">{notification.message}</p>
		</Toast>
	{/each}
</div>
