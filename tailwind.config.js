/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#da9a39',
					dark: '#ac7c34',
					50: '#FDFBF6',
					100: '#FAF2E5',
					200: '#F5E5CB',
					300: '#F0D5AD',
					400: '#EAC68F',
					500: '#E4B671',
					600: '#E0A957',
					700: '#DA9A39',
					800: '#9B681D',
					900: '#4D340E',
					950: '#271A07'
				}
			}
		}
	}
};
