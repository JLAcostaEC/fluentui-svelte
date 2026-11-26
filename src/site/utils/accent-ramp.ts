export const accentSteps = ['light-3', 'light-2', 'light-1', 'base', 'dark-1', 'dark-2', 'dark-3'] as const;
export const defaultAccent = '#0078D4';

export type AccentAnchor = 'base' | 'dark-1' | 'light-2' | 'both';

export function normalizeAccentAnchor(value: unknown): AccentAnchor {
	if (value === 'light-1') return 'light-2';
	return value === 'dark-1' || value === 'light-2' || value === 'both' ? value : 'base';
}

type RGB = [number, number, number];
type TextColor = '#000' | '#fff';
type AccentTextColors = Record<'light' | 'dark', { primary: TextColor; secondary: TextColor }>;

const white: RGB = [255, 255, 255];
const black: RGB = [0, 0, 0];
const lightSurface: RGB = [249, 249, 249];
const darkSurface: RGB = [40, 40, 40];

const defaultRamp: RGB[] = [
	[152, 236, 254],
	[96, 204, 254],
	[0, 147, 249],
	[0, 120, 212],
	[0, 94, 183],
	[0, 61, 146],
	[0, 25, 104]
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function normalizeAccent(value: unknown) {
	if (typeof value !== 'string') return null;
	const hex = value.trim().replace(/^#/, '');
	if (/^[0-9a-f]{3}$/i.test(hex))
		return (
			'#' +
			[...hex]
				.map((channel) => channel + channel)
				.join('')
				.toUpperCase()
		);
	if (/^[0-9a-f]{6}$/i.test(hex)) return '#' + hex.toUpperCase();
	return null;
}

function hexToRgb(hex: string): RGB {
	const value = parseInt(hex.slice(1), 16);
	return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export const rgbToHex = (channels: RGB) =>
	'#' +
	channels
		.map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();

const toLinear = (value: number) => {
	const fraction = value / 255;
	return fraction <= 0.04045 ? fraction / 12.92 : ((fraction + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (value: number) => 255 * (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055);

function rgbToOklch(channels: RGB) {
	const [r, g, b] = channels.map(toLinear);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	return [lightness, Math.hypot(a, bAxis), ((Math.atan2(bAxis, a) * 180) / Math.PI + 360) % 360];
}

function oklchToLinear(lightness: number, chroma: number, hue: number): RGB {
	const a = chroma * Math.cos((hue * Math.PI) / 180);
	const b = chroma * Math.sin((hue * Math.PI) / 180);
	const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	];
}

const toRgb = ([r, g, b]: RGB): RGB => [
	fromLinear(clamp(r, 0, 1)),
	fromLinear(clamp(g, 0, 1)),
	fromLinear(clamp(b, 0, 1))
];

function oklchToRgb(lightness: number, chroma: number, hue: number) {
	for (let i = 0; i < 40; i++) {
		const linear = oklchToLinear(lightness, chroma, hue);
		if (linear.every((channel) => channel >= -0.0005 && channel <= 1.0005)) return toRgb(linear);
		chroma *= 0.9;
	}
	return toRgb(oklchToLinear(lightness, 0, hue));
}

function luminance(color: RGB) {
	const [r, g, b] = color.map(toLinear);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: RGB, b: RGB) {
	const x = luminance(a);
	const y = luminance(b);
	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

export function generateAccentRamp(hex: string, anchor: AccentAnchor = 'base'): RGB[] {
	if (anchor === 'both') {
		const baseIndex = accentSteps.indexOf('base');
		const light = generateAccentRamp(hex, 'light-2');
		const dark = generateAccentRamp(hex, 'dark-1');
		return [...light.slice(0, baseIndex), ...dark.slice(baseIndex)];
	}

	const accent = normalizeAccent(hex) ?? defaultAccent;
	if (anchor === 'base' && accent === defaultAccent) return defaultRamp.map(([r, g, b]) => [r, g, b]);

	const color = hexToRgb(accent);
	const [lightness, chroma, hue] = rgbToOklch(color);
	const anchorIndex = accentSteps.indexOf(anchor);
	const plan = [
		[0.94, 0.42],
		[0.85, 0.8],
		[0.73, 1],
		[clamp(lightness, 0.52, 0.68), 1],
		[0.5, 0.95],
		[0.4, 0.85],
		[0.28, 0.7]
	];
	const [referenceLightness, referenceChroma] = plan[anchorIndex];
	const anchorLightness = clamp(lightness, 0, 1);

	// Scale each side toward its endpoint to retain the ordering at the edges of the gamut.
	const lightnesses = plan.map(([level]) =>
		level <= referenceLightness
			? (level / referenceLightness) * anchorLightness
			: 1 - ((1 - level) / (1 - referenceLightness)) * (1 - anchorLightness)
	);
	const make = (index: number) => oklchToRgb(lightnesses[index], chroma * (plan[index][1] / referenceChroma), hue);
	const ramp = plan.map((_, index) => (index === anchorIndex ? color : make(index)));

	const fix = (index: number, against: RGB, direction: number) => {
		if (index === anchorIndex) return;
		for (let count = 0; count < 80 && contrast(ramp[index], against) < 4.6; count++) {
			lightnesses[index] = clamp(lightnesses[index] + direction * 0.01, 0, 1);
			ramp[index] = make(index);
		}
	};

	fix(4, white, -1);
	lightnesses[5] = clamp(lightnesses[5], 0, Math.max(0, lightnesses[4] - 0.09));
	ramp[5] = make(5);
	fix(5, lightSurface, -1);
	lightnesses[6] = clamp(lightnesses[6], 0, Math.max(0, lightnesses[5] - 0.1));
	ramp[6] = make(6);
	fix(1, black, 1);
	lightnesses[0] = clamp(lightnesses[0], Math.min(1, lightnesses[1] + 0.06), 1);
	ramp[0] = make(0);
	fix(0, darkSurface, 1);

	const round = (value: number) => clamp(Math.round(value), 0, 255);
	return ramp.map(([r, g, b]) => [round(r), round(g), round(b)]);
}

function contrastingText(...backgrounds: RGB[]): TextColor {
	const againstWhite = Math.min(...backgrounds.map((background) => contrast(background, white)));
	const againstBlack = Math.min(...backgrounds.map((background) => contrast(background, black)));
	return againstWhite > againstBlack ? '#fff' : '#000';
}

function composite(fill: RGB, surface: RGB, opacity: number): RGB {
	const [r, g, b] = fill.map((channel, index) => opacity * channel + (1 - opacity) * surface[index]);
	return [r, g, b];
}

export function accentTextColors(ramp: RGB[]): AccentTextColors {
	const lightFill = ramp[4];
	const darkFill = ramp[1];
	return {
		light: {
			primary: contrastingText(lightFill),
			secondary: contrastingText(composite(lightFill, lightSurface, 0.84), composite(lightFill, lightSurface, 0.67))
		},
		dark: {
			primary: contrastingText(darkFill),
			secondary: contrastingText(composite(darkFill, darkSurface, 0.7), composite(darkFill, darkSurface, 0.6))
		}
	};
}

export function accentVividTextColors(ramp: RGB[]) {
	return { primary: contrastingText(ramp[1]), secondary: contrastingText(ramp[0]) };
}

export function accentChecks(ramp: RGB[], text?: AccentTextColors) {
	return [
		contrast(ramp[4], text?.light.primary === '#000' ? black : white),
		contrast(ramp[1], text?.dark.primary === '#fff' ? white : black),
		contrast(ramp[5], lightSurface),
		contrast(ramp[0], darkSurface)
	];
}

export const accentProperties = (ramp: RGB[]) =>
	accentSteps.map((step, index) => ['--fs-accent-' + step, ramp[index].join(', ')] as const);

export const accentTextProperties = ({ primary, secondary }: { primary: string; secondary: string }) =>
	[
		['--fs-text-on-accent-primary', primary],
		['--fs-text-on-accent-secondary', secondary]
	] as const;

function cssRule(selector: string, properties: readonly (readonly [string, string])[]) {
	return `${selector} {\n${properties.map(([key, value]) => `\t${key}: ${value};`).join('\n')}\n}`;
}

export function accentCss(ramp: RGB[], text?: AccentTextColors) {
	const colors = accentProperties(ramp);
	if (!text) return cssRule(':root', colors);

	const { light, dark } = text;
	const adaptive = accentTextProperties({
		primary: `light-dark(${light.primary}, ${dark.primary})`,
		secondary: `light-dark(${light.secondary}, ${dark.secondary})`
	});
	const root = cssRule(':root', [...colors, ...adaptive]);
	const darkRule = cssRule(':is(html:has(.dark), html.dark):root', accentTextProperties(dark));
	return `${root}\n\n${darkRule}`;
}
