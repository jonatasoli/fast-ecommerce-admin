<script lang="ts">
	import { TrashBinSolid } from 'flowbite-svelte-icons';
	import { tv } from 'tailwind-variants';
	import { fade } from 'svelte/transition'; // Importa a transição fade
	import { notifications } from '$lib/notifications';
	import { goto, invalidate } from '$app/navigation';

	const input = tv({
		base: 'text-gray-900 text-sm focus:ring-blue-500 focus:border-primary block p-2.5 outline-none'
	});

	interface $$Props {
		label: string;
		id: string;
		name: string;
		error?: string[] | null;
		multipleFiles: FileList | null;
		selectedFiles: File[];
		dataInput: {
			base_url: string;
			product_id: number;
			token: string;
		};
	}

	export let label = 'Label';
	export let error: string[] | null | undefined = [];
	export let multipleFiles: FileList | null = null;
	export let dataInput: { base_url: string; product_id: number; token: string };
	export let selectedFiles: File[] = [];

	function handleInputAdd(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			const newFiles = Array.from(target.files);
			selectedFiles = [...selectedFiles, ...newFiles];
		}
	}

	async function removeFile(media_id: number) {
		const res = await fetch(
			`${dataInput.base_url}/product/media/${dataInput.product_id}?media_id=${media_id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${dataInput.token}`
				}
			}
		);

		if (res.status === 204) {
			notifications.success('Produto removido com sucesso!', 3000);

			const scrollY = window.scrollY;

			await goto(window.location.href, { invalidateAll: true, noScroll: true });

			window.scrollTo({ top: scrollY });
		} else {
			notifications.danger('Erro ao remover produto', 3000);
		}
	}

	function removeFileFromSelectedFiles(event: Event, file: File) {
		event.preventDefault();

		selectedFiles = selectedFiles.filter((f) => f !== file);
		notifications.success('Produto removido com sucesso!', 3000);
	}
	</script>

<div>
	<label for="files" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
		{label}
	</label>

	<div class="border rounded-lg flex gap-4 p-2 items-center">
		<input class={input()} type="file" multiple on:input={handleInputAdd} />
	</div>

	{#if selectedFiles.length > 0}
		<div class="py-4">
			<span class="text-primary-700 font-semibold text-lg">Arquivos adicionados para envio</span>
		</div>
		<div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
			{#each selectedFiles as file, index}
				<div
					class="mt-2 p-2 border rounded-lg relative flex justify-center group"
					transition:fade={{ duration: 300 }}
				>
					{#if file.type.startsWith('image')}
						<div class="relative">
							<img
								src={URL.createObjectURL(file)}
								alt="Imagem Selecionada"
								class="w-full h-64 object-contain rounded-lg"
							/>
							<span
								class="absolute top-2 left-2 text-white font-bold text-xl bg-black bg-opacity-50 px-2 py-1 rounded-lg"
							>
								{index + 1}
							</span>
							<button
								class="absolute top-2 right-2 p-2 bg-primary-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								on:click={(event) => removeFileFromSelectedFiles(event, file)}
							>
								<TrashBinSolid class="w-6 h-6" />
							</button>
						</div>
					{:else if file.type.startsWith('video')}
						<div class="relative">
							<video
								controls
								class="w-full h-64 object-contain rounded-lg"
								src={URL.createObjectURL(file)}
							>
								Seu navegador não suporta a tag de vídeo.
							</video>
							<span
								class="absolute top-2 left-2 text-white font-bold text-xl bg-black bg-opacity-50 px-2 py-1 rounded-lg"
							>
								{index + 1}
							</span>
							<button
								class="absolute top-2 right-2 p-2 bg-primary-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								on:click={(event) => removeFileFromSelectedFiles(event, file)}
							>
								<TrashBinSolid class="w-6 h-6" />
							</button>
						</div>
					{:else}
						<div class="text-center text-gray-500">
							<p>Tipo de arquivo não suportado</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if multipleFiles && multipleFiles.length > 0}
		<div class="py-4">
			<span class="text-primary-700 font-semibold text-lg">Arquivos Armazenados</span>
		</div>
		<div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
			{#each multipleFiles.sort((a, b) => a.order - b.order) as file, index}
				<div
					class="mt-2 p-2 border rounded-lg relative flex justify-center group"
					transition:fade={{ duration: 300 }}
				>
					{#if file.type === 'PHOTO'}
						<div class="relative">
							<img src={file.uri} alt="Imagem" class="w-full h-64 object-contain rounded-lg" />

							<span
								class="absolute top-2 left-2 text-white font-bold text-xl bg-black bg-opacity-50 px-2 py-1 rounded-lg"
							>
								{file.order + 1}
							</span>

							<button
								class="absolute top-2 right-2 p-2 bg-primary-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								type="button"
								on:click={(event) => {
									event.preventDefault();
									removeFile(file.media_id);
								}}
							>
								<TrashBinSolid class="w-6 h-6" />
							</button>
						</div>
					{:else}
						<div class="relative">
							<video controls class="w-full h-64 object-contain rounded-lg" src={file.uri}>
								Seu navegador não suporta a tag de vídeo.
							</video>
							<span
								class="absolute top-2 left-2 text-white font-bold text-xl bg-black bg-opacity-50 px-2 py-1 rounded-lg"
							>
								{index + 1}
							</span>
							<button
								class="absolute top-2 right-2 p-2 bg-primary-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
								on:click={(event) => removeFileFromSelectedFiles(event, file)}
							>
								<TrashBinSolid class="w-6 h-6" />
							</button>
						</div>
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
