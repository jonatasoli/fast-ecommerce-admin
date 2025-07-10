// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0] || 'pt-BR';
	const url = new URL(event.request.url);
	const accessToken = event.cookies.get('access_token');
	const days = 30;
	const secondsInDay = 60 * 60 * 24;
	const maxAge = days * secondsInDay;

	const isProtectedRoute = url.pathname.startsWith('/admin');

	if (!accessToken && isProtectedRoute) {
		console.log('No token, redirecting from', url.pathname); // Debug
		throw redirect(302, '/');
	}

	const existingLocale = event.cookies.get('i18n_redirected');
	if (!existingLocale) {
		event.cookies.set('i18n_redirected', lang, {
			path: '/',
			maxAge: maxAge
		});
	}

	locale.set(lang);
	const response = await resolve(event);
	return response;
};
