import {
	createHighlighter,
	type HighlighterCore,
	type BundledHighlighterOptions,
	type BundledLanguage,
	type BundledTheme
} from 'shiki/bundle/web';

export const DEFAULT_LANGS: BundledLanguage[] = ['javascript', 'typescript', 'svelte', 'html', 'css', 'json', 'bash'];
export const DEFAULT_THEMES: BundledTheme[] = ['one-light', 'one-dark-pro'];

let highlighter: HighlighterCore | null = null;

export const getHighlighter = async (
	options?: BundledHighlighterOptions<BundledLanguage, BundledTheme>
): Promise<HighlighterCore> => {
	if (highlighter) return highlighter;

	const _options: BundledHighlighterOptions<BundledLanguage, BundledTheme> = options ?? {
		themes: DEFAULT_THEMES,
		langs: DEFAULT_LANGS
	};

	highlighter = await createHighlighter(_options);

	return highlighter;
};

export const updateHighlighter = async (
	options: BundledHighlighterOptions<BundledLanguage, BundledTheme>
): Promise<HighlighterCore> => {
	if (highlighter) {
		highlighter.dispose();
		highlighter = null;
	}

	highlighter = await createHighlighter(options);

	return highlighter;
};
