import type { ComputePositionConfig, Placement } from '@floating-ui/dom';
import type { Component, Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith TooltipProps */
export type TooltipProps = {
	/** The content to display in the tooltip.
	 * @type string | Snippet | Component
	 * @default 'I am a tooltip'
	 */
	content?: string | Snippet | Component;
	/** The class to apply to the tooltip. */
	class?: string;
	/** The DOM reference of the tooltip element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The element the tooltip is anchored to. Falls back to the rendered children. */
	target?: HTMLElement;
	/** Controls the open state of the tooltip.
	 * @default false
	 * @bindable
	 */
	open?: boolean;
	/** Whether the tooltip has an arrow pointing at its target.
	 * @default false
	 */
	withArrow?: boolean;
	/** The position configuration handed over to floating-ui.
	 * @type ComputePositionConfig
	 */
	positionConfig?: Partial<ComputePositionConfig>;
	/** The delay in milliseconds before the tooltip is shown.
	 * @default 100
	 */
	openDelay?: number;
	/** The delay in milliseconds before the tooltip is hidden.
	 * @default 300
	 */
	hideDelay?: number;
	/** Callback function that is called when the visibility of the tooltip changes. */
	onVisibleChange?: (visible: boolean) => void;
	/** The relationship of the tooltip to its target, which decides how it is announced.
	 * @default 'label'
	 */
	relationship?: 'label' | 'description' | 'inaccessible';
	/** Where the tooltip is placed relative to its target. */
	placement?: Placement;
	/** The id of the tooltip element, referenced by the target. Falls back to a generated id. */
	id?: string;
	/** Keeps the tooltip open until it is closed by hand.
	 * @default false
	 * @bindable
	 */
	preventClose?: boolean;
	/** Repositions the tooltip on every animation frame, for a target that keeps moving.
	 * @default false
	 */
	animationFrame?: boolean;
	/** The target of the tooltip. It receives the ARIA attributes and the attachment to spread on your element.
	 * @type Snippet
	 */
	children?: Snippet<[{ 'aria-labelledby'?: string; 'aria-describedby'?: string }, Attachment]>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
