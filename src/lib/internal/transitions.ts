import { DURATION } from '$constants';

const reducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface FlyToOffsetOptions {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	y?: number;
	x?: number;
	offset?: number;
	css?: string;
}

/** Fades and scales an element in/out. */
export function fadeScale(
	node: HTMLElement,
	{
		delay = 0,
		duration = DURATION.NORMAL,
		easing = (x: number) => x,
		baseScale = 0
	}: { delay?: number; duration?: number; easing?: (x: number) => number; baseScale?: number } = {}
) {
	const opacity = +getComputedStyle(node).opacity;
	const initialScale = 1 - baseScale;

	return {
		delay,
		duration: reducedMotion() ? 0 : duration,
		css: (t: number) => {
			const eased = easing(t);
			return `opacity: ${eased * opacity}; transform: scale(${eased * initialScale + baseScale})`;
		}
	};
}

/**
 * Moves an element to a specific axis offset while fading in/out.
 * Useful for aligning enter/exit animations with FloatingUI positioning.
 */
export function flyToOffset(
	node: Element,
	{ delay = 0, duration = DURATION.NORMAL, easing = (t: number) => t, y, x, offset = 0, css }: FlyToOffsetOptions = {}
) {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		delay,
		duration: reducedMotion() ? 0 : duration,
		easing,
		css: (t: number) => {
			const eased = easing(t);
			const translation = y
				? `translateY(${y * (1 - eased) + offset * eased}px)`
				: x
					? `translateX(${x * (1 - eased) + offset * eased}px)`
					: '';
			return `opacity: ${eased * opacity}; transform: ${transform} ${translation}; ${css || ''}`;
		}
	};
}
