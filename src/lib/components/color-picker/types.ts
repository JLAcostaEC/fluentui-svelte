import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { NativeFieldAttributes } from '#internal';
import type { Shapes } from '#types';

export type ColorPickerFormat = 'rgb' | 'hsv';
export type ColorPickerColor = { h: number; s: number; v: number; a: number };

/** @propsmith ColorPickerProps */
export type ColorPickerProps = {
	/** Accessible channel labels, overriding the English defaults. */
	channelLabels?: Partial<
		Record<'hue' | 'saturation' | 'brightness' | 'opacity' | 'red' | 'green' | 'blue' | 'hex', string>
	>;
	/** The CSS color submitted by the field. User edits produce hexadecimal colors.
	 * @bindable
	 */
	value?: string;
	/** Initial color and the value restored by a native form reset.
	 * @default '#ffffff'
	 */
	defaultValue?: string;
	/** Shape of the hue/saturation spectrum.
	 * @default 'rounded'
	 */
	shape?: Shapes;
	/** Arrangement of the spectrum, sliders and fields.
	 * @default 'vertical'
	 */
	orientation?: 'vertical' | 'horizontal';
	/** Hides the channel fields until the user expands them.
	 * @bindable
	 */
	collapsed?: boolean;
	/** Channel fields displayed in the editor.
	 * @default 'rgb'
	 * @bindable
	 */
	format?: ColorPickerFormat;
	/** Enables the opacity slider and alpha channel. */
	alpha?: boolean;
	/** Accessible name of the picker.
	 * @default 'Color picker'
	 */
	label?: string;
	/** Accessible name of the channel format selector.
	 * @default 'Color format'
	 */
	formatLabel?: string;
	/** Label of the expansion control.
	 * @default 'More'
	 */
	moreLabel?: string;
	/** Label of the collapse control.
	 * @default 'Less'
	 */
	lessLabel?: string;
	/** Message used for an invalid CSS color. */
	validationMessage?: string;
	/** Reports a user color edit. */
	onColorChange?: (value: string) => void;
	/** Native form field reference.
	 * @bindable
	 */
	ref?: HTMLInputElement | null;
	/** Visible picker reference.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement | null;
	/** Attributes for the visible picker. */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
} & Omit<NativeFieldAttributes<HTMLInputAttributes>, 'value' | 'defaultValue' | 'type' | 'size' | 'children' | 'on:'>;

export type ColorPickerControlProps = ColorPickerProps & { labelId?: string };
