import { describe, expect, it } from 'vitest';
import { findAt, fromAnchor, layoutLabels, toAnchor } from '../utils.ts';

describe('AnnotatedScrollBar utils', () => {
	it('maps the ends of the content to the ends of the rail and back', () => {
		expect(toAnchor(0, 1000, 200)).toBe(0);
		expect(toAnchor(1000, 1000, 200)).toBe(1200);
		expect(toAnchor(400, 1000, 200)).toBe(500);
		for (const offset of [0, 30, 100, 400, 950, 1000])
			expect(fromAnchor(toAnchor(offset, 1000, 200), 1000, 200)).toBeCloseTo(offset);
		// Overflow shorter than the viewport.
		for (const offset of [0, 20, 50]) expect(fromAnchor(toAnchor(offset, 50, 200), 50, 200)).toBeCloseTo(offset);
	});

	it('moves labels apart when they all fit', () => {
		expect(layoutLabels([0, 0, 100], 20, 200, 4)).toEqual([0, 24, 100]);
		expect(layoutLabels([190, 190], 20, 200, 4)).toEqual([156, 180]);
	});

	it('hides colliding labels, keeping the first and favoring later ones', () => {
		expect(layoutLabels([0, 10, 20, 30, 40, 50], 20, 50, 4)).toEqual([0, null, null, null, null, 30]);
		expect(layoutLabels([0, 5, 30], 20, 50, 4)).toEqual([0, null, 30]);
	});

	it('finds the label and the subgroups at an offset', () => {
		const categories = [
			{
				label: '2024',
				offset: 100,
				subgroups: [
					{ label: 'June', offset: 120, end: 200 },
					{ label: 'July', offset: 120, end: 200 },
					{ label: 'December', offset: 250 }
				]
			},
			{ label: '2023', offset: 400, subgroups: [] }
		];
		expect(findAt(categories, 50)).toEqual({ label: undefined, subgroups: [] });
		expect(findAt(categories, 150)).toEqual({ label: '2024', subgroups: ['June', 'July'] });
		expect(findAt(categories, 220)).toEqual({ label: '2024', subgroups: [] });
		expect(findAt(categories, 399)).toEqual({ label: '2024', subgroups: ['December'] });
		expect(findAt(categories, 400)).toEqual({ label: '2023', subgroups: [] });
	});
});
