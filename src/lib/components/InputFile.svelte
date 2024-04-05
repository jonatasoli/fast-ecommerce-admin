<script lang="ts">
	import { tv } from 'tailwind-variants';

	const input = tv({
		base: 'text-gray-900 text-sm focus:ring-blue-500 focus:border-primary block p-2.5 outline-none',
	});

	type Input = Omit<Partial<HTMLInputElement>, 'max' | 'min' | 'step' | 'files'>;

	interface $$Props extends Partial<Input> {
        label: string
		error?: string[] | null
		max?: string | number
		step?: string | number
		min?: string | number
        files: FileList | null;
    }
    
    export let label = 'Label';
	export let error: string[] | null | undefined = [];
    export let files: FileList | null | undefined;

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        files = target.files;
    }
</script>

<div>
	<label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
    <div class="border rounded-lg flex gap-20 items-center">
        <input class={input()} on:input={handleInput} type="file" {...$$restProps} />
    </div>
    {#if files}
     <div class="mt-2 p-2 border rounded-lg flex justify-center">
         <img src={URL.createObjectURL(files[0])} alt="Imagem do produto" class="w-full h-64 object-contain rounded-lg" />

     </div>
    {/if}
	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>