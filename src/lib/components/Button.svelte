<script lang="ts">
	import { tv } from 'tailwind-variants';

	const button = tv({
		base: 'cursor-pointer font-semibold rounded-xl p-2',
		variants: {
			variant: {
				primary: 'bg-primary text-white hover:bg-primary-dark',
				secondary: 'bg-white text-primary hover:bg-gray-100 border border-gray-300',
				danger: 'bg-red-600 text-white hover:bg-red-700'
			},
			block: {
				true: 'w-full',
				false: ''
			}
		}
	});
    
	interface $$Props extends Partial<HTMLButtonElement> {
    	variant?: 'primary' | 'secondary' | 'danger';
		block?: boolean;
	}

    export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
	export let block: boolean = false;
</script>

<button on:click class={button({ variant, block })} {...$$restProps}><slot /></button>
