import type { VirtualElement } from '@floating-ui/dom';

export const EASING = {
	EASE_IN: 'ease-in',
	EASE_OUT: 'ease-out',
	EASE_IN_OUT: 'ease-in-out',
	LINEAR: 'linear'
} as const;

export const DURATION = {
	REDUCED: 0,
	FAST: 167,
	NORMAL: 333,
	SLOW: 500
} as const;

export const DIRECTION = {
	DOWN: 'down',
	UP: 'up',
	LEFT: 'left',
	RIGHT: 'right'
} as const;

export const PREFIX = 'fs';

export const DEFAULT_OFFSET = 8;

export const VIRTUAL_ELEMENT: VirtualElement = {
	getBoundingClientRect() {
		return {
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};
	}
};
