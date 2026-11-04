import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import Wrapper from './SideNavTestWrapper.svelte';

it('renders named links and a controlled toggle during SSR without browser globals', () => {
	const { body } = render(Wrapper, { props: { collapsed: true } });
	expect(body).toContain('aria-label="Main navigation"');
	expect(body).toContain('aria-expanded="false"');
	expect(body).toContain('href="#home"');
	expect(body).toContain('aria-label="Home"');
});
