<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';

	import '../../app.css';

	let pathname = '';

	function active(pathname: string, receivedPathname: string) {
		const formattedPathname = pathname.replace(/\/$/, '');
		return formattedPathname === receivedPathname ? 'text-primary' : 'text-gray-600';
	}

	async function logout() {
		const resp = await fetch(`/api/auth/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await resp.json();
		if (data.success) {
			goto('/admin');
		}
	}

	$: pathname = $page.url.pathname;
</script>

<main>
	<header class="flex items-center justify-between gap-4 border-b border-b-gray-200 shadow-sm p-4">
		<h1 class="text-primary text-xl font-bold">Gatto Rosa Admin</h1>
		<nav class="flex gap-4">
			<a href="/admin" class={active(pathname, '/admin')}>Inicio</a>
			<a href="/admin/products" class={active(pathname, '/admin/products')}>Produtos</a>
			<a href="/admin/inventory" class={active(pathname, '/admin/inventory')}>Estoque</a>
			<a href="/admin/invoices" class={active(pathname, '/admin/invoices')}>Fiscal</a>
			<a href="/admin/logistics" class={active(pathname, '/admin/logistics')}>Logistica</a>
			<a href="/admin/management" class={active(pathname, '/admin/management')}
				>Gestão de Usuários</a
			>
			<a href="/admin/sales" class={active(pathname, '/admin/sales')}>Vendas</a>
			<a href="/admin/settings" class={active(pathname, '/admin/settings')}>Configurações</a>
		</nav>
		<Button variant="secondary" on:click={logout}>Sair</Button>
	</header>
	<slot />
</main>
