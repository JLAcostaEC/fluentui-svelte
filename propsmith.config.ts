import { defineConfig, type KeyContext } from '@jlacostaec/propsmith';
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
      	PolymorphicProps: "HTML Attributes",
    	}
		}
	},

	i18n: paraglide({ project: './project.inlang', key })
});
