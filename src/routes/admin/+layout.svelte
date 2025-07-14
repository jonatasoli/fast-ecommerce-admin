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
			goto('/');
		}
	}

	$: pathname = $page.url.pathname;
</script>

<main>
	<header
		class="flex items-center justify-between gap-4 border-b border-b-gray-200 shadow-sm p-4 print:hidden"
	>
		<h1 class="text-primary text-xl font-bold">{$_('layoutPage.MainPage.title')}</h1>
		<nav class="flex gap-4">
			<a href="/admin" class={active(pathname, '/admin')}>{$_('layoutPage.Home')}</a>
			<a href="/admin/products" class={active(pathname, '/admin/products')}
				>{$_('layoutPage.ProductPage')}</a
			>
			<a href="/admin/inventory" class={active(pathname, '/admin/inventory')}
				>{$_('layoutPage.Stock')}</a
			>
			<a href="/admin/invoices" class={active(pathname, '/admin/invoices')}
				>{$_('layoutPage.Fiscal')}</a
			>
			<a href="/admin/logistics" class={active(pathname, '/admin/logistics')}
				>{$_('layoutPage.Logistics')}</a
			>
			<a href="/admin/coupons" class={active(pathname, '/admin/coupons')}
				>{$_('layoutPage.Coupons')}</a
			>
			<a href="/admin/management" class={active(pathname, '/admin/management')}
				>{$_('layoutPage.UserManagement')}</a
			>
			<a href="/admin/commissions" class={active(pathname, '/admin/commissions')}
				>{$_('layoutPage.Commissions')}</a
			>
			<a href="/admin/sales" class={active(pathname, '/admin/sales')}>{$_('layoutPage.Sales')}</a>
			<a href="/admin/settings" class={active(pathname, '/admin/settings')}
				>{$_('layoutPage.Settings')}</a
			>
		</nav>
		<Button variant="secondary" on:click={logout}>{$_('layoutPage.Logout')}</Button>
	</header>
	<slot />
</main>
