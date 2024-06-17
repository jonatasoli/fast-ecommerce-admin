import { loginSchema } from '$lib/schemas/login';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const form = await superValidate(zod(loginSchema));
	const token = cookies.get('access_token');

	return {
		form,
		token
	};
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const cleanCpf = form.data.username.replace(/\D/g, '');

		const payload = {
			username: cleanCpf,
			password: form.data.password
		};

		const res = await fetch(`/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		const data = await res.json();

		if (data.message === 'INVALID_CREDENTIALS') {
			return fail(401, {
				error: 'Credenciais inválidas',
				form
			});
		}

		if (data.message === 'UNAUTHORIZED') {
			return fail(403, {
				error: 'Usuário não autorizado',
				form
			});
		}

		if (!data.success) {
			return fail(422, {
				error: 'Erro ao fazer login',
				form
			});
		}

		return {
			success: true,
			form
		};
	}
};
