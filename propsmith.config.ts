import { defineConfig, type Catalog, type I18nAdapter, type KeyContext } from '@jlacostaec/propsmith';
import { svelteAdapter } from '@jlacostaec/propsmith/adapters';
import { paraglide } from '@jlacostaec/propsmith/i18n/adapters';

/** propsmith's own word splitter, mirrored so the prefixed keys keep the exact shape it would write. */
const WORD = /[A-Z]+(?![a-z])[0-9]*|[A-Za-z][a-z0-9]*|[0-9]+/g;

const snake = (text: string) => {
	const words = text.match(WORD);
	if (words === null) return '_';
	const key = words.join('_').toLowerCase();
	return /^[0-9]/.test(key) ? `_${key}` : key;
};

/** `generated_fs_` in front of the key propsmith derives by default, so a generated message is greppable. */
const key = (ctx: KeyContext) => {
	const component = snake(ctx.component);
	const prop = snake(ctx.prop);

	switch (ctx.kind) {
		case 'deprecated':
			return `generated_fs_${component}_props_${prop}_deprecated`;
		case 'type':
			return `generated_fs_global_types_${snake(ctx.type ?? '')}`;
		case 'label':
			return `generated_fs_${component}_${prop}`;
		default:
			return `generated_fs_${component}_props_${prop}`;
	}
};

// The catalog stores code as `{#code}x{/code}` (rendered by <I18nMarkupMessage>); propsmith works in `x` backticks.
// These helpers convert between the two for generated messages only.
const GENERATED_KEY_PREFIX = 'generated_fs_';
const INLINE_CODE = /`([^`\n]+)`/g;
const MARKUP_CODE = /\{#code\}([\s\S]*?)\{\/code\}/g;

const mapGeneratedMessages = (catalog: Catalog, transform: (message: string) => string): Catalog =>
	Object.fromEntries(
		Object.entries(catalog).map(([locale, messages]) => [
			locale,
			Object.fromEntries(
				Object.entries(messages).map(([messageKey, message]) => [
					messageKey,
					messageKey.startsWith(GENERATED_KEY_PREFIX) ? transform(message) : message
				])
			)
		])
	);

const codeMarkupToMarkdown = (message: string) =>
	message.replace(MARKUP_CODE, (_, code: string) => `\`${code.replace(/\\([{}])/g, '$1')}\``);

const markdownToCodeMarkup = (message: string) =>
	message.replace(INLINE_CODE, (_, code: string) => `{#code}${code.replace(/[{}]/g, '\\$&')}{/code}`);

const paraglideAdapter = paraglide({
	project: './project.inlang',
	key,
	// Backticks get the tag past propsmith's no-HTML check; svelte.config.js strips them again.
	expression: (messageKey) => `\`<I18nMarkupMessage message={m.${messageKey}} />\``
});

const i18n: I18nAdapter = {
	...paraglideAdapter,
	load: () => mapGeneratedMessages(paraglideAdapter.load(), codeMarkupToMarkdown),
	save: (catalog) => paraglideAdapter.save(mapGeneratedMessages(catalog, markdownToCodeMarkup))
};

export default defineConfig({
	sources: ['src/**/*.{ts,svelte}'],
	ignore: ['**/*.{test,spec}.ts', '**/*.stories.*'],
	adapters: [svelteAdapter()],

	outputs: [
		{
			name: 'docs',
			files: ['src/lib/components/**/docs/**/*.svx'],
			columns: ['name', 'type', 'default', 'description'],
			description: 'i18n'
		},
		{
			name: 'llms',
			files: ['src/lib/components/**/docs/llms.md'],
			columns: ['name', 'type', 'default', 'description'],
			// The machine lane: plain English, and absolute glossary links, because an `llms.md`
			// is read away from the site that would resolve a root-relative one.
			description: 'text',
			glossary: 'https://fluentui-svelte.dev/docs/types/'
		},
		{
			name: 'types',
			files: ['src/routes/docs/types/+page.svx']
		}
	],

	types: {
		inlineUnder: 60,
		glossary: '/docs/types/',
		links: {},
		extras: {
			origins: {
				PolymorphicProps: 'HTML Attributes'
			}
		}
	},

	i18n
});
