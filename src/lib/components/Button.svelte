<script lang="ts">
	import { Button, Spinner } from 'flowbite-svelte';
	import { tv } from 'tailwind-variants';
  
	const button = tv({
	  variants: {
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
	  additionalClass?: string;
	}
  
	export let block: boolean = false;
	export let loading: boolean = false;
	export let additionalClass: string = '';
  </script>
  
  <Button
	on:click {...$$restProps}
	class={`${button({ block, loading })} ${additionalClass}`}
  >
	{#if loading}
	  <Spinner class="me-3" size="4" />
	{/if}
	<slot />
  </Button>
  