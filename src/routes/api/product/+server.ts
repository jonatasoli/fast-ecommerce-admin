import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	await request;
	return json('test');
}
