import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

let highlighter: Promise<HighlighterCore> | null = null;

export const getHighlighter = (): Promise<HighlighterCore> =>
	(highlighter ??= createHighlighterCore({
		themes: [import('shiki/themes/one-light.mjs'), import('shiki/themes/one-dark-pro.mjs')],
		langs: [
			import('shiki/langs/javascript.mjs'),
			import('shiki/langs/typescript.mjs'),
			import('shiki/langs/svelte.mjs'),
			import('shiki/langs/html.mjs'),
			import('shiki/langs/css.mjs'),
			import('shiki/langs/json.mjs'),
			import('shiki/langs/bash.mjs')
		],
		engine: createJavaScriptRegexEngine()
	}).catch((error) => {
		// A failed start is tried again by the next example.
		highlighter = null;
		throw error;
	}));
