import type { Placement } from '@floating-ui/dom';
import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type SliderProps = {
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	ticks?: number[];
	tickPlacement?: 'around' | 'before' | 'after';
	prefix?: string;
	suffix?: string;
	track?: boolean;
	orientation?: 'horizontal' | 'vertical';
	reverse?: boolean;
	disabled?: boolean;
	sync?: boolean;
	tooltip?: boolean;
	tooltipPlacement?: Placement;
	tooltipContent?: string | Snippet | Component;
	stepUp?: (step?: number) => void;
	stepDown?: (step?: number) => void;
	onChange?: (value: number) => void;
	class?: string;
	ref?: HTMLElement;
	inputRef?: HTMLInputElement;
	thumbRef?: HTMLElement;
	tooltipRef?: HTMLElement;
	railRef?: HTMLElement;
	trackRef?: HTMLElement;
	tickBarRef?: HTMLElement;
} & HTMLAttributes<HTMLDivElement>;

export type MouseOrTouchEvent = MouseEvent | TouchEvent;
