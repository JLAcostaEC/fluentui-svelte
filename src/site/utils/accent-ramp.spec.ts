import { describe, expect, it } from 'vitest';
import {
	accentChecks,
	accentCss,
	accentSteps,
	accentTextColors,
	accentVividTextColors,
	defaultAccent,
	generateAccentRamp,
	normalizeAccentAnchor,
	rgbToHex
} from './accent-ramp.js';

it('keeps the dark theme selected when restoring the previous anchor', () => {
	expect(normalizeAccentAnchor('light-1')).toBe('light-2');
});

describe('accent text contrast', () => {
	it.each(['#000000', '#FFFFFF', '#757575'])('passes in both themes for the shared accent %s', (color) => {
		const ramp = generateAccentRamp(color, 'both');
		const checks = accentChecks(ramp, accentTextColors(ramp));
		expect(checks[0]).toBeGreaterThanOrEqual(4.5);
		expect(checks[1]).toBeGreaterThanOrEqual(4.5);
		expect(checks.slice(2)).toEqual(accentChecks(ramp).slice(2));
	});

	it('uses the theme surface when choosing text for translucent accent fills', () => {
		const text = accentTextColors(generateAccentRamp('#686868', 'both'));
		expect(text.light).toEqual({ primary: '#fff', secondary: '#000' });
		expect(text.dark).toEqual({ primary: '#fff', secondary: '#fff' });
	});

	it('uses the actual fill of the landing page buttons for each state', () => {
		const ramp = generateAccentRamp('#000000', 'both');
		expect(accentVividTextColors(ramp)).toEqual({ primary: '#fff', secondary: '#000' });
	});

	it('exports text overrides for both themes only when enabled', () => {
		const ramp = generateAccentRamp(defaultAccent);
		const original = accentCss(ramp);
		expect(original).not.toContain('--fs-text-on-accent-');

		const css = accentCss(ramp, accentTextColors(ramp));
		expect(css).toContain(original.slice(0, -1));
		expect(css).toContain('--fs-text-on-accent-primary: light-dark(#fff, #000);');
		expect(css).toContain('--fs-text-on-accent-secondary: light-dark(');
		expect(css).toContain(':is(html:has(.dark), html.dark):root');
	});
});

describe('generateAccentRamp', () => {
	it('uses the stock ramp by default', () => {
		expect(generateAccentRamp(defaultAccent).map(rgbToHex)).toEqual([
			'#98ECFE',
			'#60CCFE',
			'#0093F9',
			'#0078D4',
			'#005EB7',
			'#003D92',
			'#001968'
		]);
	});

	it.each(['base', 'dark-1', 'light-2'] as const)('keeps the selected hex at %s', (anchor) => {
		const index = accentSteps.indexOf(anchor);
		for (const color of [defaultAccent, '#FF00FF', '#FFFFFF', '#000000']) {
			expect(rgbToHex(generateAccentRamp(color, anchor)[index])).toBe(color);
		}
	});

	it.each(['dark-1', 'light-2'] as const)('recalculates tones on both sides of %s', (anchor) => {
		const input = '#808080';
		const original = generateAccentRamp(input).map(rgbToHex);
		const ramp = generateAccentRamp(input, anchor).map(rgbToHex);
		const index = accentSteps.indexOf(anchor);

		expect(ramp).toEqual([...ramp].sort().reverse());
		expect(ramp.slice(0, index)).not.toEqual(original.slice(0, index));
		expect(ramp.slice(index + 1)).not.toEqual(original.slice(index + 1));
	});

	it('keeps the same color for both themes and calculates the surrounding shades', () => {
		const input = '#808080';
		const ramp = generateAccentRamp(input, 'both').map(rgbToHex);
		const pinned = ['light-2', 'dark-1'];

		expect(accentSteps.filter((_, index) => ramp[index] === input)).toEqual(pinned);
		expect(ramp.slice(0, 3)).toEqual(generateAccentRamp(input, 'light-2').slice(0, 3).map(rgbToHex));
		expect(ramp.slice(3)).toEqual(generateAccentRamp(input, 'dark-1').slice(3).map(rgbToHex));
	});

	it('reports failing contrast without adjusting the selected tone', () => {
		const ramp = generateAccentRamp('#FFFFFF', 'dark-1');
		expect(accentChecks(ramp)[0]).toBe(1);
		expect(accentChecks(generateAccentRamp('#000000', 'light-2'))[1]).toBe(1);
	});
});
