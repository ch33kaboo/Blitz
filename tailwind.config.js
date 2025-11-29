export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				blitz: {
					primary: '#3b82f6',
					secondary: '#60a5fa',
					accent: '#2563eb',
					neutral: '#1e293b',
					'base-100': '#0f172a',
					'base-200': '#1e293b',
					'base-300': '#334155',
					info: '#3b82f6',
					success: '#10b981',
					warning: '#f59e0b',
					error: '#ef4444'
				}
			}
		]
	}
};
