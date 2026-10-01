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
	markup: ({ content, filename }) => {
		if (!filename?.endsWith('.svx') || !content.includes('`<I18nMarkupMessage message={m.')) return;

		PROPSMITH_I18N_MARKUP.lastIndex = 0;
		const code = content.replace(PROPSMITH_I18N_MARKUP, '<I18nMarkupMessage message={m.$1} />');

		return { code };
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	preprocess: [
		propsmithI18nMarkup,
		mdsvex({
			rehypePlugins: [
				/** @type {any} */ (rehypeSlug),
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
							lang: /** @type {import('shiki').BundledLanguage | import('shiki').SpecialLanguage} */ (lang),
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
			$i18n: 'src/i18n',
			$constants: 'src/lib/internal/constants.js'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
