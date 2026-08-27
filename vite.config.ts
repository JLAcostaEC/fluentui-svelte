import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/i18n',
			strategy: ['url', 'cookie', 'baseLocale'],
			emitGitIgnore: true,
			emitTsDeclarations: true
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					testTimeout: 120_000,
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					setupFiles: ['./vitest-setup-client.ts'],
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	},
	// Optimize deps to avoid issues with vitest on Github Actions
	optimizeDeps: {
		include: [
			'@floating-ui/dom',
			'fluentui-icons-svelte',
			'fluentui-icons-svelte/ArrowCircleLeftRegular.svelte',
			'fluentui-icons-svelte/CaretDownFilled.svelte',
			'fluentui-icons-svelte/CaretUpFilled.svelte',
			'fluentui-icons-svelte/CheckmarkCircleFilled.svelte',
			'fluentui-icons-svelte/CheckmarkCircleRegular.svelte',
			'fluentui-icons-svelte/CheckmarkFilled.svelte',
			'fluentui-icons-svelte/ChevronDownFilled.svelte',
			'fluentui-icons-svelte/ChevronRightFilled.svelte',
			'fluentui-icons-svelte/ChevronRightRegular.svelte',
			'fluentui-icons-svelte/ChevronUpFilled.svelte',
			'fluentui-icons-svelte/CircleFilled.svelte',
			'fluentui-icons-svelte/CircleRegular.svelte',
			'fluentui-icons-svelte/ClockFilled.svelte',
			'fluentui-icons-svelte/DismissCircleFilled.svelte',
			'fluentui-icons-svelte/DismissCircleRegular.svelte',
			'fluentui-icons-svelte/DismissFilled.svelte',
			'fluentui-icons-svelte/ErrorCircleFilled.svelte',
			'fluentui-icons-svelte/EyeHideFilled.svelte',
			'fluentui-icons-svelte/EyeShowFilled.svelte',
			'fluentui-icons-svelte/InfoFilled.svelte',
			'fluentui-icons-svelte/ProhibitedFilled.svelte',
			'fluentui-icons-svelte/SearchFilled.svelte',
			'fluentui-icons-svelte/SubtractCircleFilled.svelte',
			'fluentui-icons-svelte/SubtractCircleRegular.svelte',
			'fluentui-icons-svelte/SubtractFilled.svelte',
			'fluentui-icons-svelte/WarningFilled.svelte',
			'mode-watcher',
			'runed',
			'tabspot',
			'@humanspeak/svelte-virtual-list'
		]
	}
});
