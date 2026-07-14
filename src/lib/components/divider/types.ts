import type { Appearances, PolymorphicProps, XDirection } from '$types';

export type DividerProps<Tag extends DividerGenerics = 'div'> = {
	/** The HTML element to render the divider as. */
	as?: Tag;
	ref?: DividerElement[Tag];
	vertical?: boolean;
	alignContent?: XDirection;
	inset?: boolean;
	appearance?: Appearances | 'default';
} & PolymorphicProps<Tag>;

export type DividerElement = {
	div: HTMLDivElement;
	hr: HTMLHRElement;
	span: HTMLSpanElement;
};

export type DividerGenerics = 'div' | 'hr' | 'span';
