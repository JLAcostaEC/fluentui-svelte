import type { HTMLLabelAttributes } from 'svelte/elements';
import type { Sizes } from '$types';

export type LabelProps = {
	disabled?: boolean;
	required?: {
		abbr?: string;
		message: string;
	};
	size?: Sizes;
	weight?: 'regular' | 'semibold';
	ref?: HTMLLabelElement;
	label?: string;
	labelPosition?: 'before' | 'after' | 'above' | 'below';
} & HTMLLabelAttributes;
