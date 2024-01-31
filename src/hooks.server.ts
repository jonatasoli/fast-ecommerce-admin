import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const url = new URL(event.request.url);
	const accessToken = event.cookies.get('access_token');

    const protectedPaths = url.pathname.includes('/admin')
	if (!accessToken && protectedPaths) {
		throw redirect(302, '/');
	}

    const response = await resolve(event)

    return response
};
