import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import SsrTestWrapper from './SsrTestWrapper.svelte';

/** The server HTML of one case of the wrapper. */
const html = (name: string) => render(SsrTestWrapper, { props: { name } }).body;

/** The text a visitor reads in the first element whose opening tag matches `open`. */
const textOf = (markup: string, open: RegExp) => {
	const start = markup.search(open);
	if (start < 0) return null;
	const tag = /<([a-z]+)/.exec(markup.slice(start))![1];
	const end = markup.indexOf(`</${tag}>`, start);
	return strip(markup.slice(start, end));
};

const strip = (markup: string) =>
	markup
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/** The opening tags that match `pattern`. */
const tags = (markup: string, pattern: RegExp) => markup.match(new RegExp(pattern.source, 'g')) ?? [];

/** The text of every option a carousel of the popup has selected. */
const selectedOptions = (markup: string) =>
	[...markup.matchAll(/<div[^>]*role="option"[^>]*aria-selected="true"[^>]*>([\s\S]*?)<\/div>/g)].map(([, inner]) =>
		strip(inner)
	);

describe('server-rendered text', () => {
	it('Dropdown shows the text of the selected option, not its value', () => {
		expect(textOf(html('dropdown'), /<button[^>]*role="combobox"/)).toBe('Banana');
	});

	it('Dropdown shows the text of every selected option', () => {
		expect(textOf(html('dropdown-multiple'), /<button[^>]*role="combobox"/)).toBe('Apple, Banana');
	});

	it('TagPicker names each tag with the text of its option, not its value', () => {
		const markup = html('tag-picker');
		expect(markup).toContain('title="Apple"');
		expect(markup).toContain('title="Banana"');
		expect(markup).not.toContain('title="a1"');
	});

	it('TimePicker shows its value, not the clock of the server', () => {
		expect(textOf(html('time-picker'), /<button[^>]*class="fs-time-picker/)).toBe('13 45 30');
	});

	it('TimePicker shows its value on a 12-hour clock', () => {
		expect(textOf(html('time-picker-12'), /<button[^>]*class="fs-time-picker/)).toBe('01 45 30 PM');
	});

	it('CalendarView opens on the month of `today` and marks that day by its date, not a timestamp', () => {
		const markup = html('calendar-view');
		expect(markup).toContain('March 2024');
		expect(markup).toContain('data-date="2024-03-05"');
		expect(markup).not.toMatch(/data-date="\d{10,}"/);
	});
});

describe('popups rendered open on the server', () => {
	it('TimePicker selects its value in the popup', () => {
		expect(selectedOptions(html('time-picker-open'))).toEqual(['13', '45', '30']);
	});

	it('DatePicker selects its value in the popup', () => {
		expect(selectedOptions(html('date-picker-open'))).toEqual(['15', 'March', '2024']);
	});
});

describe('server-rendered state', () => {
	it('DropdownSelect leaves its placeholder unselected when it holds values', () => {
		const [placeholder] = tags(html('dropdown-select-multiple'), /<option[^>]*fs-dropdown-placeholder[^>]*>/);
		expect(placeholder).not.toMatch(/\sselected/);
	});

	it('Checkbox marks the mixed state with an attribute, since `indeterminate` is only a property', () => {
		const [input] = tags(html('checkbox-indeterminate'), /<input[^>]*type="checkbox"[^>]*>/);
		expect(input).toContain('data-indeterminate');
	});

	it('TreeView gives its first item the tab stop, so the tree can be reached before Tabspot runs', () => {
		const items = tags(html('tree-view'), /<li[^>]*role="treeitem"[^>]*>/);
		expect(items.map((item) => /tabindex="0"/.test(item))).toEqual([true, false, false]);
	});

	it('ListView keeps a single tab stop in composite navigation', () => {
		const rows = tags(html('list-view-composite'), /<li[^>]*data-value="[^"]*"[^>]*>/);
		expect(rows.map((row) => /tabindex="0"/.exec(row) !== null)).toEqual([true, false, false]);
	});
});
