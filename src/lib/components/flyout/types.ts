import type { AutoPlacementOptions, Placement } from '@floating-ui/dom';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type FlyoutProps = {
	/** Get the DOM reference of the flyout element. */
	ref?: HTMLElement;
	/* The children elements to render inside the flyout */
	children?: Snippet;
	/** If true, use floating-ui for positioning */
	floating?: boolean;
	/** Reference element for floating-ui */
	reference?: HTMLElement;
	/** Placement for floating-ui */
	placement?: Placement;
	/** Callback when the placement changes */
	onPlacementChange?: (placement: Placement) => void;
	/** Which corners to round */
	roundCorners?: 'all' | 'top' | 'bottom' | 'left' | 'right';
	/** Offset for floating-ui */
	offset?: number;
	placementConfig?: AutoPlacementOptions;
} & HTMLAttributes<HTMLDivElement>;
