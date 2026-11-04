import { afterEach, describe, expect, it, vi } from 'vitest';
import { pxToRem } from './utils.ts';

afterEach(() => vi.unstubAllGlobals());

describe('pxToRem', () => {
	it('falls back to 16px without a browser', () => {
		vi.stubGlobal('window', undefined);
		expect(pxToRem(32)).toBe('2rem');
		expect(pxToRem('20.5px')).toBe('1.28125rem');
		expect(pxToRem(() => 24)).toBe('1.5rem');
	});

	it('reads the current computed root font size on every call', () => {
		let fontSize = '20px';
		vi.stubGlobal('window', { document: { documentElement: {} }, getComputedStyle: () => ({ fontSize }) });
		expect(pxToRem(400.25)).toBe('20.0125rem');
		fontSize = '25px';
		expect(pxToRem(400.25)).toBe('16.01rem');
		expect(pxToRem(400.25, 16)).toBe('25.015625rem');
	});

	it.each(['', '0px', '-1px', 'NaN', 'Infinity'])('falls back to 16px for an unusable root size: %s', (fontSize) => {
		vi.stubGlobal('window', { document: { documentElement: {} }, getComputedStyle: () => ({ fontSize }) });
		expect(pxToRem(32)).toBe('2rem');
	});
});
