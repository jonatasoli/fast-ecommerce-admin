<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import '../../app.css';

    async function logout() {
        const resp = await fetch(`/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await resp.json();
        if (data.success) {
            goto('/')
        }
    }
</script>

<main>
	<header class="flex items-center justify-between gap-4 border-b border-b-gray-200 shadow-sm p-4">
		<h1 class="text-primary text-xl font-bold">Gatto Rosa Admin</h1>
		<Button variant="secondary" on:click={logout}>Sair</Button>
	</header>
	<slot />
</main>
