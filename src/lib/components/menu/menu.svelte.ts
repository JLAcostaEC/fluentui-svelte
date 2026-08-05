import { createFSContext, getOffset } from '$internal';
import type { FlyToOffsetOptions } from '$internal';
import type { Alignment, ComputePositionConfig, Placement, Side, VirtualElement } from '@floating-ui/dom';
import type { MenuContext } from './types.ts';

export const COMPONENT_NAME = 'fs-menu-';

export const [getMenuContext, setMenuContext] = createFSContext<MenuContext>();

/** Distance, in pixels, the popover keeps from the anchor edge when a vertical intro starts. */
const VERTICAL_INTRO_DISTANCE = 10;

/** Distance, in pixels, a horizontal intro slides out of the anchor edge. */
const HORIZONTAL_INTRO_DISTANCE = 15;

type Rect = Omit<DOMRect, 'toJSON'>;

/**
 * Rect of an element relative to its `offsetParent`, which is the coordinate space an absolutely
 * positioned sibling lives in. It matches what FloatingUI resolves for such an element.
 */
const getOffsetRect = (element: HTMLElement): Rect => ({
	x: element.offsetLeft,
	y: element.offsetTop,
	top: element.offsetTop,
	left: element.offsetLeft,
	right: element.offsetLeft + element.offsetWidth,
	bottom: element.offsetTop + element.offsetHeight,
	width: element.offsetWidth,
	height: element.offsetHeight
});

export type IntroCoordsOptions = {
	/** Placement FloatingUI is configured with. */
	placement: Placement;
	/** Bounding rect of the reference (trigger) element. */
	anchor: Rect;
	/** Size of the popover itself, needed to resolve centered, `end`, `top` and `left` placements. */
	floating: { width: number; height: number };
	/** Main axis distance applied by the `offset` middleware. */
	offset?: number;
};

export type IntroTransitionOptions = {
	/** Config handed over to FloatingUI, the placement and the offset are read from it. */
	config: Partial<ComputePositionConfig>;
	/** Bounding rect of the reference (trigger) element. */
	anchor: Rect;
	/** The popover element, measured to resolve the placements that depend on its own size. */
	element?: HTMLElement | null;
	/** Reference (trigger) element, a submenu animates relative to it. */
	ref?: HTMLElement | VirtualElement | null;
	isSubMenu?: boolean;
};

/**
 * Resolves the coordinates FloatingUI settles the popover at for the given placement, in the same
 * space as the anchor rect it is given: the viewport for a menu, the parent popover for a submenu.
 *
 * The `in:` transition runs before FloatingUI has computed anything, so the animation has to start
 * and end on these coordinates for the handover to be seamless.
 */
export const getIntroCoords = ({ placement, anchor, floating, offset = 0 }: IntroCoordsOptions) => {
	const [side, alignment] = placement.split('-') as [Side, Alignment | undefined];
	const isVertical = side === 'top' || side === 'bottom';

	// Main axis: the popover sits right outside the anchor edge, pushed away by the `offset` middleware.
	const main =
		side === 'top'
			? anchor.top - floating.height - offset
			: side === 'bottom'
				? anchor.bottom + offset
				: side === 'left'
					? anchor.left - floating.width - offset
					: anchor.right + offset;

	// Cross axis: flush with the anchor start or end edge, centered when the placement has no alignment.
	const anchorStart = isVertical ? anchor.left : anchor.top;
	const anchorSize = isVertical ? anchor.width : anchor.height;
	const floatingSize = isVertical ? floating.width : floating.height;
	const cross =
		alignment === 'start'
			? anchorStart
			: alignment === 'end'
				? anchorStart + anchorSize - floatingSize
				: anchorStart + (anchorSize - floatingSize) / 2;

	return isVertical ? { top: main, left: cross } : { top: cross, left: main };
};

/**
 * Builds the `flyToOffset` options for the popover intro: the popover emerges from the anchor and
 * lands exactly where FloatingUI will keep it (or should, if element is not crossing the viewport), so nothing jumps when the transition ends.
 */
export const getIntroTransition = ({
	config,
	anchor,
	element,
	ref,
	isSubMenu = false
}: IntroTransitionOptions): FlyToOffsetOptions => {
	const offset = getOffset(config);
	const placement = config.placement ?? (isSubMenu ? 'right-start' : 'bottom-start');
	const [side] = placement.split('-') as [Side];
	const isVertical = side === 'top' || side === 'bottom';

	// A submenu is absolutely positioned inside its parent popover, so it is placed in the coordinate
	// space of that popover instead of the viewport, the very same space FloatingUI resolves it in.
	const rect = isSubMenu && ref instanceof HTMLElement ? getOffsetRect(ref) : anchor;

	const { top, left } = getIntroCoords({
		placement,
		anchor: rect,
		floating: element?.getBoundingClientRect() ?? { width: 0, height: 0 },
		offset
	});

	// The popover starts overlapping the anchor and slides out of it, towards the resolved
	// coordinates: a vertical intro emerges from the whole anchor, a horizontal one just peeks out.
	const travel = isVertical ? rect.height + offset - VERTICAL_INTRO_DISTANCE : HORIZONTAL_INTRO_DISTANCE;
	const distance = side === 'top' || side === 'left' ? travel : -travel;

	return {
		...(isVertical ? { y: distance } : { x: distance }),
		css: `top: ${top}px; left: ${left}px;`
	};
};
