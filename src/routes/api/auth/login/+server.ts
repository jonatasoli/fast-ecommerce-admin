import { SERVER_BASE_URL } from '$env/static/private';
import { json, type Cookies } from '@sveltejs/kit';

export async function POST({ request, cookies }: { request: Request; cookies: Cookies }) {
	const existingToken = cookies.get('access_token');

	const body = await request.json();
	const bodyEncoded = Object.keys(body)
		.map((key) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`;
		})
		.join('&');
	try {
		const res = await fetch(`${SERVER_BASE_URL}/user/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: bodyEncoded
		});

		const data = await res.json();

		if (!data.access_token) {
			return json({
				success: false,
				message: 'INVALID_CREDENTIALS'
			});
		}
		if (data.role === 'ADMIN') {
			cookies.set('role', 'ADMIN', { path: '/' }); // Set cookie for ADMIN
		} else if (data.role === 'AFFILIATE') {
			cookies.set('role', 'AFFILIATE', { path: '/' }); // Set cookie for AFFILIATE
		} else {
			return json({
				success: false,
				message: 'UNAUTHORIZED'
			});
		}

		cookies.set('access_token', data.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60
		});

		cookies.set('userDocument', body.username, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60
		});

		return json({
			success: true,
			access_token: data.access_token,
			role: data.role
		});
	} catch {
		return json({
			success: false,
			message: 'SERVER_ERROR'
		});
	}
}
