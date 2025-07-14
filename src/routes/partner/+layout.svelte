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
	<header class="flex items-center justify-between gap-4 border-b border-b-gray-200 shadow-sm p-4">
		<h1 class="text-primary text-xl font-bold">{$_('layoutPage.MainPage.title')}</h1>
		<nav class="flex gap-4">
			<a href="/partner" class={active(pathname, '/partner')}>{$_('layoutPage.Home')}</a>
			<a href="/partner/coupons" class={active(pathname, '/partner/coupons')}
				>{$_('layoutPage.Coupons')}</a
			>
			<a href="/partner/commissions" class={active(pathname, '/partner/coupons')}
				>{$_('layoutPage.Commissions')}</a
			>
		</nav>
		<Button variant="secondary" on:click={logout}>{$_('layoutPage.Logout')}</Button>
	</header>
	<slot />
</main>
