import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { Sizes } from '$types';

export type TextBoxTypes = 'text' | 'search' | 'email' | 'url' | 'tel' | 'password' | 'number';

export type FSInput = {
	/** The type of the input element. */
	type?: TextBoxTypes;
	/** The DOM reference of the wrapper element. */
	wrapperRef?: HTMLDivElement;
	/** Get the DOM reference of the input element. */
	ref?: HTMLInputElement;
	/** The placeholder text for the input. */
	placeholder?: string;
	/** Whether to hide the extra action buttons in the input. */
	hideActionButtons?: boolean;
	/** Make the input fill the full width of the container. */
	justify?: boolean;
	contentBefore?: string | Snippet | Component;
	contentAfter?: string | Snippet | Component;
	/** The size of the input element. */
	size?: Sizes;
	/** Occurs when content changes in the text box. */
	textChanged?: (e: InputEvent, text: string) => void;
	/** The QuerySubmitted event occurs when:
	 * 1. The input type is 'search'.
	 * 2. While the focus is in the text box, press Enter or click the query icon.
	 */
	querySubmitted?: (e: MouseEvent | KeyboardEvent, query: string) => void;
	/** Occurs when the clear button is clicked. */
	onClear?: (e: MouseEvent) => void;
	/** The children elements to render inside the input. */
	children?: Snippet;
	/** The attributes to apply to the wrapper element. */
	wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
} & Omit<HTMLInputAttributes, 'size'>;
