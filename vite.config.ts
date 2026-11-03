import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { playwright } from '@vitest/browser-playwright';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import rehypeSlug from 'rehype-slug';
import { mdsvex, escapeSvelte } from 'mdsvex';
import rehypeClassNames from 'rehype-class-names';
import adapter from '@sveltejs/adapter-cloudflare';
import { fsShikiCopyButton } from './scripts/shiki-copy-button.js';
import { createHighlighter } from 'shiki';

/** @type {(import('shiki').BundledLanguage | import('shiki').LanguageInput | import('shiki').SpecialLanguage)[]} */
const langs = ['typescript', 'bash', 'css', 'svelte'];

const highlighter = await createHighlighter({
	themes: ['one-light', 'one-dark-pro'],
	langs: langs
});

const PROPSMITH_I18N_MARKUP = /`<I18nMarkupMessage message=\{m\.([A-Za-z_$][\w$]*)\} \/>`/g;

// propsmith can only write <I18nMarkupMessage /> inside backticks; unwrap them so mdsvex renders the component.
const propsmithI18nMarkup = {
	name: 'propsmith-i18n-markup',
	markup: ({ content, filename }: { content: string; filename?: string }) => {
		if (!filename?.endsWith('.svx') || !content.includes('`<I18nMarkupMessage message={m.')) return;

		PROPSMITH_I18N_MARKUP.lastIndex = 0;
		const code = content.replace(PROPSMITH_I18N_MARKUP, '<I18nMarkupMessage message={m.$1} />');

		return { code };
	}
};

export default defineConfig({
	plugins: [
		enhancedImages(), // must come before the SvelteKit plugin
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			preprocess: [
				propsmithI18nMarkup,
				mdsvex({
					rehypePlugins: [
						rehypeSlug as any,
						[
							rehypeClassNames,
							{
								'h1,h2,h3,h4,h5,h6,p,a,ol,ul,table': 'fs-docs'
							}
						]
					],
					highlight: {
						highlighter: async (code, lang = 'text') => {
							const html = escapeSvelte(
								highlighter.codeToHtml(code, {
									lang: lang as import('shiki').BundledLanguage | import('shiki').SpecialLanguage,
									themes: {
										light: 'one-light',
										dark: 'one-dark-pro'
									},
									defaultColor: 'light-dark()',
									cssVariablePrefix: '--shiki-',
									transformers: [fsShikiCopyButton()]
								})
							);
							return `{@html \`${html}\` }`;
						}
					},
					extensions: ['.svx']
				})
			],
			adapter: adapter(),
			// Every docs page pulls many small component stylesheets; inlining them avoids a render-blocking request each.
			inlineStyleThreshold: 10_000,
			extensions: ['.svelte', '.svx']
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/i18n',
			strategy: ['url', 'cookie', 'baseLocale'],
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
			'fluentui-icons-svelte/AddRegular.svelte',
			'fluentui-icons-svelte/ArrowCircleLeftRegular.svelte',
			'fluentui-icons-svelte/ArrowUpRegular.svelte',
			'fluentui-icons-svelte/CaretDownFilled.svelte',
			'fluentui-icons-svelte/CaretUpFilled.svelte',
			'fluentui-icons-svelte/CheckmarkCircleFilled.svelte',
			'fluentui-icons-svelte/CheckmarkCircleRegular.svelte',
			'fluentui-icons-svelte/CheckmarkFilled.svelte',
			'fluentui-icons-svelte/ChevronDownFilled.svelte',
			'fluentui-icons-svelte/ChevronDownRegular.svelte',
			'fluentui-icons-svelte/ChevronRightFilled.svelte',
			'fluentui-icons-svelte/ChevronRightRegular.svelte',
			'fluentui-icons-svelte/ChevronUpFilled.svelte',
			'fluentui-icons-svelte/CircleFilled.svelte',
			'fluentui-icons-svelte/CircleRegular.svelte',
			'fluentui-icons-svelte/ClockFilled.svelte',
			'fluentui-icons-svelte/DismissCircleFilled.svelte',
			'fluentui-icons-svelte/DismissCircleRegular.svelte',
			'fluentui-icons-svelte/DismissFilled.svelte',
			'fluentui-icons-svelte/DismissRegular.svelte',
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
			'fluentui-icons-svelte/StarFilled.svelte',
			'fluentui-icons-svelte/StarHalfRegular.svelte',
			'fluentui-icons-svelte/StarOneQuarterRegular.svelte',
			'fluentui-icons-svelte/StarRegular.svelte',
			'fluentui-icons-svelte/StarThreeQuarterRegular.svelte',
			'mode-watcher',
			'runed',
			'tabspot',
			'@humanspeak/svelte-virtual-list'
		]
	}
});
