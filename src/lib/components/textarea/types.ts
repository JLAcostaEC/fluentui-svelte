import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';

/** @propsmith TextAreaProps */
export type TextAreaProps = {
	/** The current value of the textarea.
	 * @default ''
	 * @bindable
	 */
	value?: string;
	/** The DOM reference of the textarea element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The placeholder text for the textarea. */
	placeholder?: string;
	/** Configures the resize behavior of the textarea.
	 * @default 'vertical'
	 */
	resize?: 'none' | 'both' | 'horizontal' | 'vertical';
	/** Callback function for the change event. */
	onChange?: (e: Event) => void;
	/** Disables the user interaction.
	 * @default false
	 */
	disabled?: boolean;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** The DOM reference of the wrapper element.
	 * @bindable
	 */
	wrapperRef?: HTMLDivElement;
} & SvelteHTMLElements['textarea'];
