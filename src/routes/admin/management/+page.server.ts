import { SERVER_BASE_URL } from '$env/static/private';
import { usersStore } from '$lib/stores/management.js';
import type { Actions } from './$types';

/** @type {import('./$types').PageLoad} */
export const load = async ({ url, cookies }) => {
	const token = cookies.get('access_token');
	const page = new URL(url).searchParams.get('page') || 1;
	const offset = new URL(url).searchParams.get('offset') || 10;
	const users = usersStore();

	await users.get(`${SERVER_BASE_URL}/users/?offset=${offset}&page=${page}`, token);

	let currentUsers;
	users.subscribe((value) => (currentUsers = value))();
	console.log(currentUsers);

	return {
		users: currentUsers,
		access_token: token,
		base_url: `${SERVER_BASE_URL}`
	};
};

export const actions: Actions = {
	fetchUsers: async ({ request, cookies }) => {
		const token = cookies.get('access_token');
		const users = usersStore();
		const form = await request.formData();

		const data = {
			offset: form.get('offset'),
			page: form.get('page')
		};

		const { offset, page } = data;

		await users.get(`${SERVER_BASE_URL}/users/?offset=${offset}&page=${page}`, token);

		let currentUsers;
		users.subscribe((value) => (currentUsers = value))();
		console.log(currentUsers);

		return {
			users: currentUsers,
			access_token: token,
			base_url: `${SERVER_BASE_URL}`
		};
	}
};
