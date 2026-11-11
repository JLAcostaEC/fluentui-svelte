import { expect, it } from 'vitest';
import { colorString, parseColor } from '../color.ts';
it.each(['#ff0000', '#00ff00', '#0000ff', '#808080', '#000000', '#ffffff', '#12ab3480'])(
	'round-trips %s through HSV',
	(input) => {
		expect(colorString(parseColor(input)!, true).toLowerCase()).toBe(input);
	}
);
it('rejects invalid and empty colors', () => {
	expect(parseColor('not a color')).toBeNull();
	expect(parseColor('')).toBeNull();
});
