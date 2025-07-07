import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'pt-BR';

register('pt-BR', () => import('../components/locale/pt.json'));
register('en-US', () => import('../components/locale/en.json'));
register('es-ES', () => import('../components/locale/es.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
