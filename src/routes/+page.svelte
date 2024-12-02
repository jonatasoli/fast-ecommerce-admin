<script lang="ts">
	import { _ } from 'svelte-i18n';
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
			console.log(result);
			if (result.type === 'success') {
				if (data.role === 'ADMIN') {
					goto('/admin');
				} else if (data.role === 'AFFILIATE') {
					goto('/partner');
				} else {
					notifications.danger('Erro ao realizar o login!', 3000);
					loading = false;
				}
			}
		},
		onUpdated: () => {
			console.log('On updated');
			if (data.role === 'ADMIN') {
				goto('/admin');
			} else if (data.role === 'AFFILIATE') {
				goto('/partner');
			} else {
				notifications.danger('Erro ao realizar o login!', 3000);
				loading = false;
			}
		}
	});

	onMount(() => {
		console.log('token');
		console.log(`um token ${data.token}`);
		if (data.token && data.role === 'ADMIN') {
			goto('/admin');
		} else if (data.token && data.role === 'AFFILIATE') {
			goto('/partner');
		} else {
			notifications.danger('Erro ao realizar o login!', 3000);
			loading = false;
		}
	});
</script>

<Toast />
<div class="flex flex-col justify-center items-center h-screen w-screen bg-slate-100">
	<div class="bg-white border rounded-lg p-16">
		<h1 class="text-primary text-2xl font-semibold text-center mb-8 uppercase">{$_('title')}</h1>
		<form class="flex flex-col gap-8" method="POST" use:enhance>
			<Input
				mask="000.000.000-00"
				label={$_('login.title')}
				name="username"
				bind:value={$form.username}
				{...$constraints.username}
				error={$errors.username}
			/>
			<Input
				label={$_('login.password')}
				name="password"
				type="password"
				bind:value={$form.password}
				{...$constraints.password}
				error={$errors.password}
			/>
			<Button name="Login" block={true} {loading} type="submit">{$_('login.title')}</Button>
		</form>
	</div>
</div>
