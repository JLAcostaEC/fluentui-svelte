import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { isHttpError } from '@sveltejs/kit';
import {
	GLOBAL_NOTE,
	SITE_URL as SCRIPT_SITE_URL,
	SKILL_PATH,
	readComponents,
	updateLlms,
	packageVersion,
	updateSkill
} from '../../scripts/gen-llms.js';
import { SITE_URL } from '#site/constants.js';
import { componentMarkdown, globalGuide, llmsComponents, llmsFull, llmsIndex } from '#site/llms.js';
import { GET as aliasGET } from '../routes/docs/components/[slug]/[file]/+server.js';

const components = readComponents();
const skill = fs.readFileSync(SKILL_PATH, 'utf-8');
const guide = (slug: string) => fs.readFileSync(`src/lib/components/${slug}/docs/llms.md`, 'utf-8');

describe('agent skill', () => {
	it('has the front matter the skills CLI needs', () => {
		const frontMatter = skill.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
		const description = frontMatter.match(/^description: (.+)$/m)?.[1] ?? '';

		expect(frontMatter).toMatch(/^name: fluentui-svelte$/m);
		expect(description.length).toBeGreaterThan(50);
		// Agent Skills spec: at most 1024 characters.
		expect(description.length).toBeLessThanOrEqual(1024);
	});

	it('is up to date with the components (run `pnpm urls`)', () => {
		expect(updateSkill(skill, components, packageVersion())).toBe(skill);
	});

	it('names the version of the package', () => {
		expect(skill).toContain(`Written for fluentui-svelte \`${packageVersion()}\``);
	});

	it('lists every Svelte component the package exports', () => {
		const listed = new Set(components.flatMap(({ exports }) => exports));
		const exported = [...fs.readFileSync('src/lib/index.ts', 'utf-8').matchAll(/export \{ default as (\w+) \}/g)];
		// The provider is not a documented component; it is in the setup section.
		const missing = exported.map(([, name]) => name).filter((name) => !listed.has(name) && name !== 'FluentUISvelte');
		expect(missing).toEqual([]);
	});

	it('lists every documented component', () => {
		for (const { folder } of components) expect(skill).toContain(`- \`${folder}\`:`);
	});
});

describe('component llms.md', () => {
	it('exists for every documented component', () => {
		expect(components.filter((component) => component.llmsPath === null).map(({ folder }) => folder)).toEqual([]);
	});

	it('points to the global guide under its title', () => {
		for (const { llmsPath } of components) {
			const llms = fs.readFileSync(llmsPath!, 'utf-8');
			expect(updateLlms(llms), llmsPath!).toBe(llms);
			expect(llms.split('\n').slice(0, 3)).toEqual([expect.stringMatching(/^# /), '', GLOBAL_NOTE]);
		}
	});

	it('imports icons from their own file, as the skill tells agents to', () => {
		for (const { llmsPath } of components) {
			expect(fs.readFileSync(llmsPath!, 'utf-8'), llmsPath!).not.toMatch(/from 'fluentui-icons-svelte'/);
		}
	});
});

describe('published Markdown', () => {
	it('uses the same origin as the site', () => {
		expect(SCRIPT_SITE_URL).toBe(SITE_URL);
	});

	it('serves the skill without its front matter as the global guide', () => {
		expect(globalGuide.startsWith('# fluentui-svelte\n')).toBe(true);
		expect(skill.endsWith(globalGuide)).toBe(true);
	});

	it('links every component from /llms.txt', () => {
		const index = llmsIndex();

		expect(index.startsWith('# ')).toBe(true);
		expect(index).toContain(`(${SITE_URL}/docs/llms.md)`);
		expect(index).toContain(`(${SITE_URL}/llms-full.txt)`);
		for (const meta of llmsComponents) expect(index).toContain(`(${SITE_URL}/docs/components/${meta.slug}.md)`);
	});

	it('serves a component guide by slug', async () => {
		expect(await componentMarkdown('button')).toBe(guide('button'));
		expect(await componentMarkdown('not-a-component')).toBeNull();
	});

	// The only test that loads every guide. Each first load goes through the whole Vite pipeline, which takes
	// seconds on a CI runner that also drives the browser tests, hence the timeout.
	it('puts the global guide and every component in /llms-full.txt', { timeout: 60_000 }, async () => {
		const full = await llmsFull();

		expect(full.startsWith('# fluentui-svelte\n')).toBe(true);
		// Read from disk: a component whose guide the site cannot load would be missing here.
		for (const meta of llmsComponents) expect(full, meta.slug).toContain(guide(meta.slug).trim());
	});

	it('keeps the old /docs/components/<slug>/llms URLs and rejects other names', async () => {
		const get = (slug: string, file: string) => aliasGET({ params: { slug, file } } as never);

		const llms = await get('button', 'llms');
		expect(llms.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
		expect(await llms.text()).toBe(await componentMarkdown('button'));
		expect((await get('button', 'llms.txt')).headers.get('Content-Type')).toBe('text/plain; charset=utf-8');

		for (const [slug, file] of [
			['button', 'foollms'],
			['not-a-component', 'llms.md']
		]) {
			const failure = await get(slug, file).catch((error: unknown) => error);
			expect(isHttpError(failure) && failure.status, `${slug}/${file}`).toBe(404);
		}
	});
});
