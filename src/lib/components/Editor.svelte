<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	interface Quill {
		getSemanticHTML(): string;
		on(event: string, callback: () => void): void;
	}

	let editor: HTMLDivElement;
	let quill: Quill;
	const dispatch = createEventDispatcher();

	export let placeholder = 'Write your story...';
	export let value = '';
	export let label = '';

	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, 'blockquote'],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ align: [] }],
		['clean']
	];

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			placeholder: placeholder
		});
	});

	$: quill && quill.on('text-change', () => {
		value = quill.getSemanticHTML();
		dispatch('change', { value: quill.getSemanticHTML() });
	});
</script>

<div>
	{#if label}
		<span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</span>
	{/if}
	<div bind:this={editor} />
</div>

<style>
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
</style>
