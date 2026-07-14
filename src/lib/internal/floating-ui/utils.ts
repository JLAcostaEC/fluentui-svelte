import { DEFAULT_OFFSET } from '$constants';
import type { ComputePositionConfig, VirtualElement } from '@floating-ui/dom';

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
