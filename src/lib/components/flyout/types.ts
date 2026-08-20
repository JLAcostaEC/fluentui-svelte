import type { AutoPlacementOptions, Placement } from '@floating-ui/dom';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith FlyoutProps */
export type FlyoutProps = {
	/** The DOM reference of the flyout element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The content of the flyout. */
	children?: Snippet;
	/** Positions the flyout with floating-ui instead of leaving it in the normal flow.
	 * @default false
	 */
	floating?: boolean;
	/** The element the flyout is positioned against when `floating` is set. */
	reference?: HTMLElement;
	/** Where the flyout is placed relative to its reference.
	 * @default 'bottom'
	 */
	placement?: Placement;
	/** Called whenever floating-ui settles on a different placement. */
	onPlacementChange?: (placement: Placement) => void;
	/** Which corners of the flyout are rounded.
	 * @default 'all'
	 */
	roundCorners?: 'all' | 'top' | 'bottom' | 'left' | 'right';
	/** The distance in pixels between the flyout and its reference.
	 * @default 8
	 */
	offset?: number;
	/** The auto placement configuration handed over to floating-ui.
	 * @type AutoPlacementOptions
	 */
	placementConfig?: AutoPlacementOptions;
} & HTMLAttributes<HTMLDivElement>;
