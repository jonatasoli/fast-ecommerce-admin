<script lang="ts">
	import { goto } from '$app/navigation';
	import '../app.css';

	let username = '';
	let password = '';
	let error = '';

	async function handleLogin() {
		const resp = await fetch(`/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				password
			})
		});
		const data = await resp.json();
		if (data.message === 'INVALID_CREDENTIALS') {
			error = 'Credenciais inválidas';
			return;
		}
		goto('/admin');
	}
</script>

<div class="flex flex-col justify-center items-center h-screen w-screen">
	<h1 class="text-primary text-2xl font-semibold text-center mb-6">GATTO ROSA ADMIN</h1>
	<div>
		<form class="rounded flex flex-col gap-2">
      <div class="h-4">
        {#if error}
          <p class="text-red-500 text-center w-full">{error}</p>
        {/if}
      </div>
			<label class="text-sm decoration-sky-500" for="login">Login</label>
			<input class="border border-black p-1" name="login" bind:value={username} />
			<label class="text-sm decoration-sku-500" for="password">Senha</label>
			<input class="border border-black p-1" name="password" bind:value={password} />
			<button
				on:click={handleLogin}
				class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				name="Login"
				type="button">Login</button
			>
		</form>
	</div>
</div>
