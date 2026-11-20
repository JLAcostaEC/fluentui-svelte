export const accentSteps = ['light-3', 'light-2', 'light-1', 'base', 'dark-1', 'dark-2', 'dark-3'] as const;
export const defaultAccent = '#0078D4';

type RGB = [number, number, number];

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

export function generateAccentRamp(hex: string): RGB[] {
	const accent = normalizeAccent(hex) ?? defaultAccent;
	if (accent === defaultAccent) return defaultRamp.map(([r, g, b]) => [r, g, b]);

	const [lightness, chroma, hue] = rgbToOklch(hexToRgb(accent));
	const plan = [
		[0.94, 0.42],
		[0.85, 0.8],
		[0.73, 1],
		[clamp(lightness, 0.52, 0.68), 1],
		[0.5, 0.95],
		[0.4, 0.85],
		[0.28, 0.7]
	];
	const lightnesses = plan.map(([level]) => level);
	const make = (index: number) => oklchToRgb(lightnesses[index], chroma * plan[index][1], hue);
	const ramp = plan.map((_, index) => make(index));

	if (lightness >= 0.52 && lightness <= 0.68) ramp[3] = hexToRgb(accent);

	const fix = (index: number, against: RGB, direction: number) => {
		for (let count = 0; count < 80 && contrast(ramp[index], against) < 4.6; count++) {
			lightnesses[index] = clamp(lightnesses[index] + direction * 0.01, 0, 1);
			ramp[index] = make(index);
		}
	};

	fix(4, [255, 255, 255], -1);
	lightnesses[5] = Math.min(lightnesses[5], lightnesses[4] - 0.09);
	ramp[5] = make(5);
	fix(5, [249, 249, 249], -1);
	lightnesses[6] = Math.min(lightnesses[6], lightnesses[5] - 0.1);
	ramp[6] = make(6);
	fix(1, [0, 0, 0], 1);
	lightnesses[0] = Math.max(lightnesses[0], lightnesses[1] + 0.06);
	ramp[0] = make(0);
	fix(0, [40, 40, 40], 1);

	const round = (value: number) => clamp(Math.round(value), 0, 255);
	return ramp.map(([r, g, b]) => [round(r), round(g), round(b)]);
}

export function accentChecks(ramp: RGB[]) {
	return [
		contrast(ramp[4], [255, 255, 255]),
		contrast(ramp[1], [0, 0, 0]),
		contrast(ramp[5], [249, 249, 249]),
		contrast(ramp[0], [40, 40, 40])
	];
}

export const accentProperties = (ramp: RGB[]) =>
	accentSteps.map((step, index) => ['--fs-accent-' + step, ramp[index].join(', ')] as const);

export const accentCss = (ramp: RGB[]) =>
	':root {\n' +
	accentProperties(ramp)
		.map(([key, value]) => '\t' + key + ': ' + value + ';')
		.join('\n') +
	'\n}';
