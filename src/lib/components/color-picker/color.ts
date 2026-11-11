import { hueyColor } from '@hueycolor/svelte';
import type { ColorPickerColor } from './types.ts';

export const clamp = (value: number, max = 100): number => Math.min(max, Math.max(0, value));

export function parseColor(value: string): ColorPickerColor | null {
	if (!value.trim()) return null;
	try {
		const color = hueyColor(value);
		const { h, s, l } = color.toHsl();
		const lightness = l / 100;
		const brightness = lightness + (s / 100) * Math.min(lightness, 1 - lightness);
		return { h, s: brightness ? 200 * (1 - lightness / brightness) : 0, v: brightness * 100, a: color.getAlpha() };
	} catch {
		return null;
	}
}

export function colorString(color: ColorPickerColor, alpha: boolean): string {
	const v = clamp(color.v) / 100;
	const s = clamp(color.s) / 100;
	const l = v * (1 - s / 2);
	const saturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
	return hueyColor(
		`hsla(${clamp(color.h, 360)}, ${saturation * 100}%, ${l * 100}%, ${alpha ? clamp(color.a, 1) : 1})`
	).toHexString();
}
