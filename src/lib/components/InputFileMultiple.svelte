<script lang="ts">
	import { tv } from 'tailwind-variants';

	const input = tv({
		base: 'text-gray-900 text-sm focus:ring-blue-500 focus:border-primary block p-2.5 outline-none'
	});

	// Modifiquei o tipo para incluir a propriedade 'multipleFiles'
	interface $$Props {
		label: string;
		id: string;
		name: string;
		error?: string[] | null;
		multipleFiles: FileList | null;
	}

	export let label = 'Label';
	export let error: string[] | null | undefined = [];
	export let multipleFiles: FileList | null = null;

	// Função para lidar com o input de múltiplos arquivos
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		multipleFiles = target.files; // Aqui você atribui os arquivos selecionados ao multipleFiles
	}
</script>

<div>
	<label for="files" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
		{label}
	</label>

	<div class="border rounded-lg flex gap-4 p-2 items-center">
		<input class={input()} type="file" multiple on:input={handleInput} />
	</div>

	{#if multipleFiles && multipleFiles.length > 0}
		<div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
			{#each Array.from(multipleFiles) as file, index (file.name)}
				<div class="mt-2 p-2 border rounded-lg flex justify-center">
					{#if file.type.startsWith('image/')}
						<img
							src={URL.createObjectURL(file)}
							alt={`Imagem ${index + 1}`}
							class="w-full h-64 object-contain rounded-lg"
						/>
					{:else if file.type.startsWith('video/')}
						<video
							controls
							src={URL.createObjectURL(file)}
							class="w-full h-64 object-contain rounded-lg"
						/>
					{:else}
						<p class="text-center text-sm text-gray-600">{file.name}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="pt-[0.15rem] h-8">
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
	</div>
</div>
