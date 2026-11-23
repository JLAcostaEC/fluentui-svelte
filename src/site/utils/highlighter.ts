import { createBundledHighlighter, createSingletonShorthands } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const createHighlighter = createBundledHighlighter({
	langs: {
		javascript: () => import('shiki/langs/javascript.mjs'),
		typescript: () => import('shiki/langs/typescript.mjs'),
		svelte: () => import('shiki/langs/svelte.mjs'),
		html: () => import('shiki/langs/html.mjs'),
		css: () => import('shiki/langs/css.mjs'),
		json: () => import('shiki/langs/json.mjs'),
		bash: () => import('shiki/langs/bash.mjs')
	},
	themes: {
		'one-light': () => import('shiki/themes/one-light.mjs'),
		'one-dark-pro': () => import('shiki/themes/one-dark-pro.mjs')
	},
	engine: () => createJavaScriptRegexEngine()
});

export const { codeToHtml } = createSingletonShorthands(createHighlighter);
