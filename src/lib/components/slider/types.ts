import type { Placement } from '@floating-ui/dom';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith SliderProps */
export type SliderProps = {
	/** The current value of the slider.
	 * @default 0
	 * @bindable
	 */
	value?: number;
	/** The minimum value of the slider.
	 * @default 0
	 */
	min?: number;
	/** The maximum value of the slider.
	 * @default 100
	 */
	max?: number;
	/** How much the value moves on every step.
	 * @default 1
	 */
	step?: number;
	/** The values the tick marks are drawn at.
	 * @default []
	 */
	ticks?: number[];
	/** Where the tick marks sit relative to the rail.
	 * @default 'around'
	 */
	tickPlacement?: 'around' | 'before' | 'after';
	/** Text prepended to the value in the tooltip.
	 * @default ''
	 */
	prefix?: string;
	/** Text appended to the value in the tooltip.
	 * @default ''
	 */
	suffix?: string;
	/** Whether to fill the rail up to the current value.
	 * @default true
	 */
	track?: boolean;
	/** The direction the slider runs in.
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical';
	/** Runs the slider from the maximum to the minimum instead.
	 * @default false
	 */
	reverse?: boolean;
	/** Disables the user interaction.
	 * @default false
	 */
	disabled?: boolean;
	/** Snaps the thumb to the pointer as soon as it is pressed, instead of stepping towards it. */
	sync?: boolean;
	/** Whether to show the value in a tooltip while dragging.
	 * @default true
	 */
	tooltip?: boolean;
	/** Where the tooltip is placed relative to the thumb.
	 * @default 'top'
	 */
	tooltipPlacement?: Placement;
	/** Custom content for the tooltip, replacing the plain value.
	 * @type string | Snippet | Component
	 */
	tooltipContent?: string | Snippet | Component;
	/** Called whenever the value changes. */
	onChange?: (value: number) => void;
	/** The class to apply to the slider. */
	class?: string;
	/** The DOM reference of the slider element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The DOM reference of the underlying input element.
	 * @bindable
	 */
	inputRef?: HTMLInputElement;
	/** The DOM reference of the thumb element.
	 * @bindable
	 */
	thumbRef?: HTMLElement;
	/** The DOM reference of the tooltip element.
	 * @bindable
	 */
	tooltipRef?: HTMLElement;
	/** The DOM reference of the rail element.
	 * @bindable
	 */
	railRef?: HTMLElement;
	/** The DOM reference of the track element.
	 * @bindable
	 */
	trackRef?: HTMLElement;
	/** The DOM reference of the tick bar element.
	 * @bindable
	 */
	tickBarRef?: HTMLElement;
} & HTMLAttributes<HTMLDivElement>;

export type MouseOrTouchEvent = MouseEvent | TouchEvent;
