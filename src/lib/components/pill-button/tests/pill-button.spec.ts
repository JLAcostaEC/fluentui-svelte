import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { PillButton } from '#lib/index.js';

describe('PillButton SSR', () => {
	it('renders a checked native field and selected surface from defaultChecked before hydration', () => {
		const { body } = render(PillButton, { props: { defaultChecked: true, name: 'filter', 'aria-label': 'Unread' } });
		expect(body).toMatch(/<span[^>]*class="[^"]*selected/);
		expect(body).toMatch(/<input[^>]*\schecked(?:=|\s|\/?>)/);
		expect(body).toContain('name="filter"');
		expect(body).toContain('aria-label="Unread"');
	});

	it('gives an explicit checked=false precedence over defaultChecked in its first render', () => {
		const { body } = render(PillButton, { props: { checked: false, defaultChecked: true, 'aria-label': 'Unread' } });
		expect(body).not.toMatch(/<span[^>]*class="[^"]*selected/);
		expect(body).not.toMatch(/<input[^>]*\schecked(?:=|\s|\/?>)/);
	});
});
