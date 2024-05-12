import routify from '@roxi/routify/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), routify({})],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
