import { DEFAULT_OFFSET } from '#constants';
import { roundByDPR } from '../utils.ts';
import type { ComputePositionConfig, ComputePositionReturn, Side, VirtualElement } from '@floating-ui/dom';

const OPPOSITE_SIDE: Record<Side, Side> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
const MASK_ANGLE: Record<Side, string> = { top: '135deg', right: '-135deg', bottom: '-45deg', left: '45deg' };

/**
 * Places a rotated square arrow on the edge of a floating element that faces its reference, from the data of the
 * `arrow` middleware. `--fs-arrow-mask-angle` tells the mask which half of the square points outward.
 */
export const placeArrow = (arrowElement: HTMLElement, { middlewareData, placement }: ComputePositionReturn) => {
	const { x, y } = middlewareData.arrow ?? {};
	const side = placement.split('-')[0] as Side;

	Object.assign(arrowElement.style, {
		left: x != null ? `${roundByDPR(x)}px` : '',
		top: y != null ? `${roundByDPR(y)}px` : '',
		right: '',
		bottom: '',
		[OPPOSITE_SIDE[side]]: `${-(arrowElement.offsetWidth / 2) + 1}px`,
		transform: 'rotate(45deg)'
	});
	arrowElement.style.setProperty('--fs-arrow-mask-angle', MASK_ANGLE[side]);
};

export const getPointerVirtualElement = (e: Event): VirtualElement => {
	if (!(e instanceof PointerEvent)) {
		throw new TypeError('Expected a PointerEvent');
	}

	return {
		getBoundingClientRect() {
			return {
				width: 0,
				height: 0,
				x: e.clientX,
				y: e.clientY,
				top: e.clientY,
				right: e.clientX,
				bottom: e.clientY,
				left: e.clientX
			};
		}
	};
};

export const getOffset = (positionConfig?: Partial<ComputePositionConfig>): number => {
	if (!positionConfig) return DEFAULT_OFFSET;

	const offsetConfig = positionConfig.middleware?.find((m) => m && m.name === 'offset');

	return offsetConfig
		? typeof offsetConfig.options === 'number'
			? offsetConfig.options
			: offsetConfig.options.mainAxis
		: DEFAULT_OFFSET;
};
