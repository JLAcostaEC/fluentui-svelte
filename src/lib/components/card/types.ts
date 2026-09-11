import type { Horientation, PolymorphicProps } from '$types';
import type { FSContext } from '$internal';
import type { HTMLAttributes } from 'svelte/elements';
import type { Component, Snippet } from 'svelte';

export type CardTagTypes = 'div' | 'article' | 'section' | 'a';

/** @propsmith CardProps */
export type CardProps<Tag extends CardTagTypes = 'div'> = {
	/** The DOM reference of the card element.
	 * @type CardElementDOMType[Tag]
	 * @bindable
	 */
	ref?: CardElementDOMType[Tag];
	/** The DOM element to render.
	 * @type 'div' | 'article' | 'section' | 'a'
	 * @default 'div'
	 */
	as?: Tag;
	/** The axis the card lays its parts out on.
	 * @default 'horizontal'
	 */
	orientation?: Horientation;
	/** Lets the user select the card by clicking anywhere on it.
	 * @default false
	 */
	selectable?: boolean;
	/** Floats the selection checkbox over the top right corner of the card.
	 *
	 * Only available on selectable cards, and ignored when the card renders as a link.
	 * @default false
	 */
	showFloatingAction?: boolean;
	/** The id of the card element. Falls back to a generated one. */
	id?: string;
	/** Whether the card is selected. Only available on selectable cards.
	 * @default false
	 * @bindable
	 */
	selected?: boolean;
	/** Disables the user interaction.
	 * @default false
	 */
	disabled?: boolean;
	/** A card can have its background and borders styled for greater emphasis or to be subtle.
	 * @default 'filled'
	 */
	appearance?: 'filled' | 'outlined' | 'subtle';
	/** Called with the id of the card whenever its selection changes.
	 * @type (id: string, selected: boolean) => void
	 */
	onSelectionChange?: (id: string, selected: boolean) => void;
} & PolymorphicProps<Tag>;

export type CardElementDOMType = {
	div: HTMLDivElement;
	article: HTMLElement;
	section: HTMLElement;
	a: HTMLAnchorElement;
};

export type CardContext = FSContext<
	{
		readonly as?: CardTagTypes;
		readonly showFloatingAction?: boolean;
		readonly appearance?: 'filled' | 'outlined' | 'subtle';
		readonly selectable?: boolean;
		/** The id of the card, which every part uses to build its own ids. */
		readonly id?: string;
	},
	{
		orientation?: Horientation;
		selected?: boolean;
		disabled?: boolean;
	},
	null,
	{
		/** Toggles the selection and forwards the click to the consumer. */
		handleAction?: (e: MouseEvent) => void;
	}
>;

/** @propsmith CardPreviewProps */
export type CardPreviewProps = {
	/** The DOM reference of the preview element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The URL of the logo overlaid on the bottom left corner of the preview. */
	logoSrc: string;
	/** The media to preview, usually an image. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** @propsmith CardHeaderProps */
export type CardHeaderProps = {
	/** The DOM reference of the header element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The title of the card. A snippet or a component receives the id the floating checkbox is labelled by.
	 * @type Snippet | Component | string
	 */
	title: Snippet<[attrs: { id: string }]> | Component<{ id: string }> | string;
	/** The image rendered before the title. A string is used as the `src` of an `<img>`.
	 * @type Snippet | Component | string
	 */
	image?: Snippet | Component | string;
	/** A second line of text below the title.
	 * @type Snippet | Component | string
	 */
	description?: Snippet | Component | string;
	/** The action rendered at the end of the header. Not available on selectable cards.
	 * @type Snippet | Component
	 */
	action?: Snippet | Component;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>;

/** @propsmith CardFooterProps */
export type CardFooterProps = {
	/** The DOM reference of the footer element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The actions rendered inside the footer. Not available on selectable cards.
	 * @type Snippet | Component
	 */
	action?: Snippet | Component;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
