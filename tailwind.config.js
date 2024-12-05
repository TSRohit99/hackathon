/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				blue: {
					'600': '#2563eb'
				}
				,
				tomato_1: '#FFA270',
				EEEEEE : '#EEEEEE',
				DCE4C9: '#DCE4C9',
				F5F5DC: '#F5F5DC'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require('daisyui')],
};
