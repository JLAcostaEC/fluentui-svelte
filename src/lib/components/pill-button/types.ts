import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes, SVGAttributes } from 'svelte/elements';
import type { Shapes } from '#types';

export type PillButtonAppearance = 'filled' | 'outline' | 'brand';
export type PillButtonSize = 'small' | 'medium' | 'large' | 'extra-large';

/** Props passed to the media snippet or component. */
export type PillButtonMediaProps = {
	/** The current shape configured on PillButton. */
	shape: Shapes;
};

/** Internal surface shared by PillButton and Tag. */
export type PillButtonBaseProps = {
	as?: 'span' | 'div' | 'button';
	appearance?: PillButtonAppearance;
	size?: PillButtonSize | 'extra-small';
	shape?: Shapes;
	selected?: boolean;
	disabled?: boolean | null;
	ref?: HTMLElement | null;
	children?: Snippet;
} & Omit<HTMLButtonAttributes, 'children' | 'disabled'>;

/** @propsmith PillButtonProps */
export type PillButtonProps = {
	/** The DOM reference of the native checkbox.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** The DOM reference of the pill surface.
	 * @bindable
	 */
	wrapperRef?: HTMLElement | null;
	/** Attributes for the pill surface. Input attributes belong on the component itself. */
	wrapperAttributes?: HTMLAttributes<HTMLSpanElement>;
	/** Whether the pill is checked. When omitted, `defaultChecked` determines the initial state.
	 * @bindable
	 */
	checked?: boolean | null;
	/** The pill appearance.
	 * @default 'filled'
	 */
	appearance?: PillButtonAppearance;
	/** The height and text size of the pill: `small` is 24px/12px, `medium` is 32px/14px, `large` is 40px/16px and `extra-large` is 48px/18px.
	 * @default 'medium'
	 */
	size?: PillButtonSize;
	/** The shape of the pill: `circular`, `rounded` or `square`.
	 * @default 'circular'
	 */
	shape?: Shapes;
	/** An optional decorative Fluent icon before the content. */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** Decorative media before the text, usually an `Avatar`. Receives the pill's current `shape`; forward it to the media component. Fits the control height with a uniform 4px inset. Takes precedence over `icon`. */
	media?: Snippet<[PillButtonMediaProps]> | Component<PillButtonMediaProps>;
	/** The visible label. Provide `aria-label` or `aria-labelledby` when there is no visible text. */
	children?: Snippet;
} & Omit<HTMLInputAttributes, 'type' | 'children' | 'checked' | 'size' | 'on:'>;
