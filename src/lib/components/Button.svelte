<script lang="ts">
	import { tv } from 'tailwind-variants';

	const button = tv({
		base: 'cursor-pointer font-semibold rounded-xl p-2 flex justify-center items-center gap-2',
		variants: {
			variant: {
				primary: 'bg-primary text-white hover:bg-primary-dark',
				secondary: 'bg-white text-primary hover:bg-gray-100 border border-gray-300',
				danger: 'bg-red-600 text-white hover:bg-red-700'
			},
			block: {
				true: 'w-full',
				false: ''
			},
			loading: {
				true: 'opacity-50 pointer-events-none',
				false: ''
			}
		}
	});

	interface $$Props extends Partial<HTMLButtonElement> {
		variant?: 'primary' | 'secondary' | 'danger';
		block?: boolean;
		loading?: boolean;
	}

	export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
	export let block: boolean = false;
	export let loading: boolean = false;
</script>

<button on:click class={button({ variant, block, loading })} {...$$restProps}>
	<slot />
	{#if loading}
		<svg
			class="animate-spin h-5 w-5 ml-3 fill-white"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
			/></svg
		>
	{/if}
</button>
