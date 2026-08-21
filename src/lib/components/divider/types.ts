import type { Appearances, PolymorphicProps, XDirection } from '$types';

/** @propsmith DividerProps */
export type DividerProps<Tag extends DividerGenerics = 'div'> = {
	/** The HTML element to render the divider as.
	 * @type 'div' | 'hr' | 'span'
	 * @default 'div'
	 */
	as?: Tag;
	/** The DOM reference of the divider element.
	 * @type HTMLDivElement | HTMLHRElement | HTMLSpanElement
	 * @bindable
	 */
	ref?: DividerElement[Tag];
	/** Renders the divider vertically instead of horizontally. */
	vertical?: boolean;
	/** Where the content of the divider sits along the line.
	 * @default 'center'
	 */
	alignContent?: XDirection;
	/** Removes the padding around the divider line. */
	inset?: boolean;
	/** The divider line can be styled for greater emphasis or to be subtle.
	 * @default 'default'
	 */
	appearance?: Appearances | 'default';
} & PolymorphicProps<Tag>;

export type DividerElement = {
	div: HTMLDivElement;
	hr: HTMLHRElement;
	span: HTMLSpanElement;
};

export type DividerGenerics = 'div' | 'hr' | 'span';
