<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
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
	<header
		class="flex items-center justify-between gap-4 border-b border-b-gray-200 shadow-sm p-4 print:hidden"
	>
		<h1 class="text-primary text-xl font-bold">{$_('title')}</h1>
		<nav class="flex gap-4">
			<a href="/admin" class={active(pathname, '/admin')}>{$_('navigation.home')}</a>
			<a href="/admin/products" class={active(pathname, '/admin/products')}
				>{$_('navigation.products')}</a
			>
			<a href="/admin/inventory" class={active(pathname, '/admin/inventory')}
				>{$_('navigation.inventory')}</a
			>
			<a href="/admin/invoices" class={active(pathname, '/admin/invoices')}
				>{$_('navigation.invoice')}</a
			>
			<a href="/admin/logistics" class={active(pathname, '/admin/logistics')}
				>{$_('navigation.logistic')}</a
			>
			<a href="/admin/coupons" class={active(pathname, '/admin/coupons')}
				>{$_('navigation.coupons')}</a
			>
			<a href="/admin/management" class={active(pathname, '/admin/management')}
				>Gestão de Usuários</a
			>
			<a href="/admin/sales" class={active(pathname, '/admin/sales')}>{$_('navigation.sales')}</a>
			<a href="/admin/settings" class={active(pathname, '/admin/settings')}
				>{$_('navigation.settings')}</a
			>
		</nav>
		<Button variant="secondary" on:click={logout}>{$_('userMenu.logout')}</Button>
	</header>
	<slot />
</main>
