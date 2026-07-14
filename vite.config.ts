import rehypeSlug from 'rehype-slug';
import { defineConfig } from 'vitest/config';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { sveltekit } from '@sveltejs/kit/vite';
import rehypeClassNames from 'rehype-class-names';
import adapter from '@sveltejs/adapter-cloudflare';
import { playwright } from '@vitest/browser-playwright';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { fsShikiCopyButton } from './scripts/shiki-copy-button.js';
import { createHighlighter, type BundledLanguage, type LanguageInput, type SpecialLanguage } from 'shiki';

const langs: (BundledLanguage | LanguageInput | SpecialLanguage)[] = ['typescript', 'bash', 'css', 'svelte'];

const highlighter = await createHighlighter({
	themes: ['one-light', 'one-dark-pro'],
	langs: langs
});

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			alias: {
				$types: 'src/lib/types/index.ts',
				$internal: 'src/lib/internal/index.ts',
				$components: 'src/lib/components',
				$css: 'src/lib/css',
				$site: 'src/site',
				$docs: 'src/site/documentation',
				$i18n: 'src/i18n',
				$constants: 'src/lib/internal/constants.ts'
			},
			adapter: adapter(),
			preprocess: [
				mdsvex({
					rehypePlugins: [
						rehypeSlug as any,
						[
							rehypeClassNames as any,
							{
								'h1,h2,h3,h4,h5,h6,p,a,ol,ul,table': 'fs-docs'
							}
						]
					],
					highlight: {
						highlighter: async (code, lang = 'text') => {
							await highlighter.loadLanguage(...langs);

							const html = escapeSvelte(
								highlighter.codeToHtml(code, {
									lang: lang as BundledLanguage | SpecialLanguage,
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
					extensions: ['.svx', '.md']
				})
			],
			extensions: ['.svelte', '.svx', '.md']
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/i18n',
			strategy: ['url', 'cookie', 'baseLocale'],
			emitGitIgnore: true
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
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
	}
});
