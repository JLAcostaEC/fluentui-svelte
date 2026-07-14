import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';

export type TextAreaProps = {
	/** Get the DOM reference of the input element. */
	ref?: HTMLElement;
	/** The placeholder text for the input. */
	placeholder?: string;
	/** Configures the resize behavior of the textarea. */
	resize?: 'none' | 'both' | 'horizontal' | 'vertical';
	/** Callback function for the change event. */
	onChange?: (e: Event) => void;
	/** Whether the textarea is disabled. */
	disabled?: boolean;
	/** Attributes to be spread on the wrapper element. */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
	/** Get DOM reference of the wrapper element. */
	wrapperRef?: HTMLDivElement;
} & SvelteHTMLElements['textarea'];
