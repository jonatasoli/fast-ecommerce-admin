// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);
	const accessToken = event.cookies.get('access_token');

	const isProtectedRoute = url.pathname.startsWith('/admin');

	if (!accessToken && isProtectedRoute) {
		console.log('No token, redirecting from', url.pathname); // Debug
		throw redirect(302, '/');
	}

	const response = await resolve(event);
	return response;
};
