import type { TextBoxProps } from '../text-box/types.ts';

/** @propsmith NumberBoxProps */
export type NumberBoxProps = {
	/** The current value of the input.
	 * @bindable
	 */
	value?: number;
	/** How the increment and decrement buttons are laid out.
	 *
	 * `inline`: the buttons sit inside the input, one next to the other.
	 *
	 * `compact`: the buttons are stacked in a flyout, opened from inside the input.
	 * @default 'inline'
	 */
	variant?: 'inline' | 'compact';
} & Omit<TextBoxProps, 'type'>;
