import type { HTMLInputAttributes } from 'svelte/elements';
import type { PolymorphicProps } from '$types';
import type { Snippet } from 'svelte';

export type CheckboxProps<T extends 'div' | 'label' = 'div'> = {
	/** Get the DOM reference of the checkbox element. */
	ref?: HTMLInputElement;
	wrapperAs?: T;
	/** Get the DOM reference of the checkbox wrapper element. */
	wrapperRef?: WrapperRef[T];
	wrapperAttributes?: PolymorphicProps<T>;
	indeterminate?: boolean;
	name?: string | null;
	group?: string | null;
	checked?: boolean;
	disabled?: boolean;
	children?: T extends 'label' ? Snippet : never;
} & Omit<HTMLInputAttributes, 'on:' | 'children'>;

export type WrapperRef = {
	label: HTMLLabelElement;
	div: HTMLDivElement;
};
