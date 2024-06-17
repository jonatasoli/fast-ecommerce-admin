<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { superForm } from 'sveltekit-superforms';
	import '../app.css';
	import Input from '$lib/components/Input.svelte';

	import Toast from '$lib/components/Toast.svelte';
	import { notifications } from '$lib/notifications';
	import { onMount } from 'svelte';

	export let data;
	let loading = false;

	const { form, enhance, errors, constraints } = superForm(data.form, {
		applyAction: false,
		onSubmit: () => {
			loading = true;
		},
		onResult({ result }) {
			if (result.type === 'failure') {
				notifications.danger(result.data?.error, 3000);
				loading = false;
				return goto('/');
			}

			if (result.type === 'success') {
				console.log('sucesso');
				return goto('/admin');
			}
		}
	});

	onMount(() => {
		console.log('token');
		console.log(`um token ${data.token}`);
		if (data.token) {
			goto('/admin');
		}
	});
</script>

<Toast />
<div class="flex flex-col justify-center items-center h-screen w-screen bg-slate-100">
	<div class="bg-white border rounded-lg p-16">
		<h1 class="text-primary text-2xl font-semibold text-center mb-8">GATTO ROSA ADMIN</h1>
		<form class="flex flex-col gap-8" method="POST" use:enhance>
			<Input
				mask="000.000.000-00"
				label="Login"
				name="username"
				bind:value={$form.username}
				{...$constraints.username}
				error={$errors.username}
			/>
			<Input
				label="Senha"
				name="password"
				type="password"
				bind:value={$form.password}
				{...$constraints.password}
				error={$errors.password}
			/>
			<Button name="Login" block={true} {loading} type="submit">Login</Button>
		</form>
	</div>
</div>
