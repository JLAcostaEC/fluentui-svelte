import type { HTMLInputAttributes } from 'svelte/elements';
import type { PolymorphicProps } from '$types';

export type RadioButtonProps = {
	/** The label displayed next to the radio button. */
	label?: string;
	/** Bindable value representing a group of radio inputs that the input will be bound to. */
	group?: unknown;
	/** Get the DOM reference of the radio button element. */
	ref?: HTMLInputElement;
	labelAttributes?: PolymorphicProps<'label'>;
} & HTMLInputAttributes;
