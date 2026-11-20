import source from '#lib/index.ts?raw';

const publicComponents = /export \{ default as (\w+) \} from '\.\/components\/([^/]+)\/[^']+\.svelte'/g;

export function componentExports(slug: string) {
	return Array.from(source.matchAll(publicComponents), ([, name, folder]) => ({ name, folder }))
		.filter(({ folder }) => folder === slug)
		.map(({ name }) => name);
}
