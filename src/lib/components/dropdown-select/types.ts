import type { HTMLAttributes, HTMLSelectAttributes } from 'svelte/elements';

export type DropdownSelectProps = {
	ref?: HTMLSelectElement;
	wrapperRef?: HTMLDivElement;
	wrapperProps?: HTMLAttributes<HTMLDivElement>;
	hidePlaceholder?: boolean;
	placeholder?: string;
} & HTMLSelectAttributes;
