import type { Placement } from '@floating-ui/dom';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { HiddenInputAttributes } from '$internal';

/** @propsmith SliderProps */
export type SliderProps = {
	/** The current value of the slider.
	 * @default 0
	 * @bindable
	 */
	value?: number;
	/** The value a form reset returns the slider to. A range input without one would fall back to an empty value.
	 * @default min
	 */
	defaultValue?: number;
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
	/** Snaps the thumb to the pointer as soon as it is pressed, instead of stepping towards it. Without it, a value between two steps is drawn as it is, while the native input, and so the form, holds the nearest step. */
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
	/** The DOM reference of the native range input that holds the value and takes the keyboard focus. The other attributes of the slider are applied to it.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** The DOM reference of the element that draws the slider.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
	/** The attributes to spread on the element that draws the slider.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the thumb element.
	 * @bindable
	 */
	thumbRef?: HTMLElement | null;
	/** The DOM reference of the tooltip element.
	 * @bindable
	 */
	tooltipRef?: HTMLElement | null;
	/** The DOM reference of the rail element.
	 * @bindable
	 */
	railRef?: HTMLElement | null;
	/** The DOM reference of the track element.
	 * @bindable
	 */
	trackRef?: HTMLElement | null;
	/** The DOM reference of the tick bar element.
	 * @bindable
	 */
	tickBarRef?: HTMLElement | null;
} & HiddenInputAttributes<HTMLInputAttributes>;

export type MouseOrTouchEvent = MouseEvent | TouchEvent;
