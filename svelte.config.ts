import rehypeSlug from 'rehype-slug';
import { mdsvex, escapeSvelte } from 'mdsvex';
import rehypeClassNames from 'rehype-class-names';
import adapter from '@sveltejs/adapter-cloudflare';
import { fsShikiCopyButton } from './scripts/shiki-copy-button.js';
import { createHighlighter, type BundledLanguage, type LanguageInput, type SpecialLanguage } from 'shiki';
import type { Config } from '@sveltejs/kit';

const langs: (BundledLanguage | LanguageInput | SpecialLanguage)[] = ['typescript', 'bash', 'css', 'svelte'];

const highlighter = await createHighlighter({
	themes: ['one-light', 'one-dark-pro'],
	langs: langs
});

const config: Config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	preprocess: [
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
			}
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			$types: 'src/lib/types/index.js',
			$internal: 'src/lib/internal/index.js',
			$components: 'src/lib/components',
			$css: 'src/lib/css',
			$site: 'src/site',
			$docs: 'src/site/documentation',
			$i18n: 'src/i18n',
			$constants: 'src/lib/internal/constants.js'
		}
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
