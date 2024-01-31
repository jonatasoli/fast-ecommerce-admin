<script lang="ts">
	import { tv } from 'tailwind-variants';

	const button = tv({
		base: 'cursor-pointer font-semibold rounded-xl p-2',
		variants: {
			variant: {
				primary: 'bg-primary text-white hover:bg-primary-dark',
				secondary: 'bg-white text-primary hover:bg-gray-100 border border-gray-300'
			}
		}
	});

    export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button on:click class={button({ variant })}><slot /></button>
