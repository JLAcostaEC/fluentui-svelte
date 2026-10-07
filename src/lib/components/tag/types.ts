import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, SVGAttributes } from 'svelte/elements';
import type { FSContext } from '$internal';
import type { PolymorphicProps, Shapes } from '$types';

export type TagAppearance = 'filled' | 'outline' | 'brand';

export type TagSize = 'extra-small' | 'small' | 'medium';

/** @propsmith TagProps */
export type TagProps = {
	/** The tag can have a filled, outlined or brand appearance. Falls back to the `appearance` of the `TagGroup` it is in.
	 * @default 'filled'
	 */
	appearance?: TagAppearance;
	/** The tag comes in three sizes. Falls back to the `size` of the `TagGroup` it is in.
	 * @default 'medium'
	 */
	size?: TagSize;
	/** The tag can have a circular, rounded or square shape.
	 * @default 'circular'
	 */
	shape?: Shapes;
	/** Shows that the tag cannot be interacted with. A tag inside a disabled `TagGroup` is disabled too.
	 * @default false
	 */
	disabled?: boolean;
	/** Paints the tag as selected. Inside a `TagGroup` an interactive tag takes its selected state from the `selectedValues` of the group instead.
	 * @default false
	 */
	selected?: boolean;
	/** Shows a dismiss icon and lets the tag be dismissed. Falls back to the `dismissible` of the `TagGroup` it is in.
	 * A tag that is not interactive becomes a single button: activating it, or pressing Delete or Backspace on it, dismisses it.
	 * @default false
	 */
	dismissible?: boolean;
	/** Renders the tag as an interaction tag: a primary button that carries the action, followed, when the tag is dismissible, by a separate dismiss button.
	 * Use it for a tag that has a primary action, and a plain tag for one that does not.
	 * @default false
	 */
	interactive?: boolean;
	/** Identifies the tag inside a `TagGroup`. It is what `onDismiss` and `onTagSelect` report. Falls back to a generated id. */
	value?: string;
	/** An icon rendered before the text. Do not use it together with `media`.
	 * @type Snippet | Component
	 */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** A visual element rendered before the text, usually an `Avatar`. Do not use it together with `icon`.
	 * @type Snippet | Component
	 */
	media?: Snippet | Component;
	/** A second line of text that describes or complements the main text.
	 * @type string | Snippet
	 */
	secondaryText?: string | Snippet;
	/** The icon of the dismiss control.
	 * @default DismissRegular
	 * @type Snippet | Component
	 */
	dismissIcon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The accessible name of the dismiss control. When the tag is named through `aria-label` or `aria-labelledby`
	 * instead, the dismiss icon is hidden from assistive technologies.
	 * @default 'Dismiss'
	 */
	dismissLabel?: string;
	/** Called when the tag is dismissed. The consumer owns the data: the tag does not remove itself. */
	onDismiss?: (e: MouseEvent | KeyboardEvent, value: string) => void;
	/** Called when the tag is activated. On an interactive tag it is the click of the primary button. */
	onclick?: (e: MouseEvent) => void;
	/** Called when a key is pressed on the tag. */
	onkeydown?: (e: KeyboardEvent) => void;
	/** Attributes for the primary button of an interactive tag, for example `aria-haspopup`. If you give it
	 * a custom `id`, the dismiss button is named after it.
	 */
	primaryProps?: Omit<HTMLButtonAttributes, 'children' | 'onclick'>;
	/** Attributes for the dismiss button of an interactive tag. Use `aria-label` together with
	 * `aria-labelledby: undefined` to give the button a name that stands on its own.
	 */
	dismissProps?: Omit<HTMLButtonAttributes, 'children' | 'onclick'>;
	/** The primary text of the tag. */
	children?: Snippet;
	/** The DOM reference of the tag element.
	 * @bindable
	 */
	ref?: HTMLElement;
} & Omit<PolymorphicProps<'span'>, 'children' | 'onclick' | 'onkeydown'>;

/** @propsmith TagGroupProps */
export type TagGroupProps = {
	/** The size given to the tags of the group that do not set their own.
	 * @default 'medium'
	 */
	size?: TagSize;
	/** The appearance given to the tags of the group that do not set their own. */
	appearance?: TagAppearance;
	/** Disables every tag of the group.
	 * @default false
	 */
	disabled?: boolean;
	/** Makes the tags of the group that do not set their own dismissible. */
	dismissible?: boolean;
	/** The values of the selected interactive tags.
	 * @default []
	 * @bindable
	 */
	selectedValues?: string[];
	/** Called when an interactive tag of the group is activated, with the value it toggles. */
	onTagSelect?: (e: MouseEvent, data: { value: string; selected: boolean }) => void;
	/** Called when a tag of the group is dismissed. The consumer owns the data: the group does not remove the tag. */
	onDismiss?: (e: MouseEvent | KeyboardEvent, data: { value: string }) => void;
	/** The role of the group. Use `list` together with `role="listitem"` on each tag when none of them is actionable.
	 * @default 'toolbar'
	 */
	role?: HTMLAttributes<HTMLDivElement>['role'];
	/** The tags of the group. */
	children?: Snippet;
	/** The DOM reference of the group element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
} & Omit<PolymorphicProps<'div'>, 'children' | 'role'>;

export type TagGroupContext = FSContext<
	{
		readonly size?: TagSize;
		readonly appearance?: TagAppearance;
		readonly disabled?: boolean;
		readonly dismissible?: boolean;
	},
	{
		readonly selectedValues: string[];
	},
	null,
	{
		/** Toggles the value in `selectedValues` and reports it. */
		select: (e: MouseEvent, value: string) => void;
		/** Reports the dismissed value. */
		dismiss: (e: MouseEvent | KeyboardEvent, value: string) => void;
	}
>;
