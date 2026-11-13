import type { FSContext } from '#internal';
import type { PolymorphicProps, Sizes } from '#types';
import type { Component, Snippet } from 'svelte';

/** @propsmith SegmentedControlProps */
export type SegmentedControlProps = {
	/** The DOM reference of the control.
	 * @bindable
	 */
	ref?: HTMLDivElement | null;
	/** The value of the selected item. An empty value leaves all items unselected.
	 * @bindable
	 */
	selectedValue?: string;
	/** The field name shared by every radio. Defaults to a unique generated name. */
	name?: string;
	/** The id of the form that owns the radios, when outside that form. */
	form?: string;
	/** Requires a selection before the form can be submitted.
	 * @default false
	 */
	required?: boolean;
	/** Custom native validation message when a required selection is missing. */
	validationMessage?: string;
	/** Hides the accent indicator beneath the selected segment.
	 * @default false
	 */
	hideIndicator?: boolean;
	/** Selects the focused segment during arrow-key navigation.
	 * @default false
	 */
	selectOnFocus?: boolean;
	/** Fired when user interaction changes the selection. */
	onSelectionChange?: (event: Event, value: string) => void;
	/** The size of every segment.
	 * @default 'medium'
	 */
	size?: Sizes;
	/** Gives every segment the same width. Disable to fit each segment to its content.
	 * @default true
	 */
	equalWidth?: boolean;
	/** Disables every segment.
	 * @default false
	 */
	disabled?: boolean;
	/** Disables tabspot keyboard navigation.
	 * @default false
	 */
	disableTabspot?: boolean;
} & PolymorphicProps<'div'>;

/** @propsmith SegmentedControlItemProps */
export type SegmentedControlItemProps = {
	/** The DOM reference of the native radio input.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** A unique value identifying this segment within its control. */
	value: string;
	/** An optional icon. Give icon-only items an accessible name with `aria-label`.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** Disables this segment.
	 * @default false
	 */
	disabled?: boolean;
} & PolymorphicProps<'input', 'value' | 'type' | 'name' | 'form' | 'checked' | 'defaultChecked'> & {
		/** The content of the segment's label. */
		children?: Snippet;
	};

export type SegmentedControlContext = FSContext<
	{
		disabled: boolean;
		name: string;
		form: string | undefined;
		required: boolean;
		validationMessage: string;
		hideIndicator: boolean;
	},
	{ selectedValue: string },
	null,
	{ selectItem: (event: Event, value: string) => void }
>;
