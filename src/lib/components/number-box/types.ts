import type { FSInput } from '../text-box/types.ts';

export type NumberBoxProps = {
	value?: number;
	/** The type of the input element. (compacted variant add an interactive button to increase or decrease the number) */
	variant?: 'inline' | 'compact';
} & Omit<FSInput, 'type'>;
