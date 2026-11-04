import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import Wrapper from './AppWindowContextTestWrapper.svelte';

it('exposes host window state and inherited controls during SSR', () => {
	const { body } = render(Wrapper, { props: { active: true, maximized: true, minimized: true } });
	expect(body).toContain('"maximized":true');
	expect(body).toContain('"minimized":true');
	expect(body).toContain('aria-label="Restore"');
});
