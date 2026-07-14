import type { ComputePositionConfig, Placement } from '@floating-ui/dom';
import type { Component, Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';

export type TooltipProps = {
	class?: string;
	/** Get the DOM reference of the tooltip element. */
	ref?: HTMLElement;
	/** Target element or reference for the tooltip. */
	target?: HTMLElement;
	/** The text to display in the tooltip. */
	content?: string | Snippet | Component;
	/** Whether the tooltip is open. */
	open?: boolean;
	/** Whether the tooltip has an arrow. */
	withArrow?: boolean;
	/** The position configuration of the tooltip. */
	positionConfig?: Partial<ComputePositionConfig>;
	/** The delay in milliseconds before the tooltip is shown. */
	openDelay?: number;
	/** The delay in milliseconds before the tooltip is hidden. */
	hideDelay?: number;
	/** Callback function that is called when the visibility of the tooltip changes. */
	onVisibleChange?: (visible: boolean) => void;
	/** The relationship of the tooltip to the target element. */
	relationship?: 'label' | 'description' | 'inaccessible';
	placement?: Placement;
	id?: string;
	preventClose?: boolean;
	animationFrame?: boolean;
	children?: Snippet<[{ 'aria-labelledby'?: string; 'aria-describedby'?: string }, Attachment]>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
