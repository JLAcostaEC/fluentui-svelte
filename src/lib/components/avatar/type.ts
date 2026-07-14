import type { Component, Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import type { BadgePresence } from '../badge/types.ts';
import type { ActiveOrInactive, Colors, PolymorphicProps, Shapes } from '$types';

export type AvatarProps = {
	/** The name of the person or entity represented by this Avatar. This should always be provided if it is available.
	 *
	 * The name is used to determine the initials displayed when there is no image. It is also provided to accessibility tools. */
	name?: string;
	/** The Avatar's image
	 *
	 * Can be only a single image url, or an array of sources `HTMLSourceAttributes[]`.
	 */
	image?: {
		src: string;
	};
	/** The DOM reference of the avatar element. */
	ref?: HTMLDivElement;
	/** Size of the avatar in pixels. */
	size?: number;
	/** The avatar can have a circular, rounded or square shape. */
	shape?: Shapes;
	/** The color when displaying either an icon or initials. For now it only supports system colors (plus colorful). */
	color?: Colors | 'colorful';
	/** Optional activity indicator
	 *
	 * `active`: the avatar will be decorated according to activeAppearance
	 *
	 * `inactive`: the avatar will be reduced in size and partially transparent
	 * */
	active?: ActiveOrInactive;
	/** The appearance when `active="active"` */
	activeAppearance?: 'ring' | 'shadow' | 'ring-shadow';
	/** Custom initials.
	 *
	 * It is usually not necessary to specify custom initials; by default they will be derived from the `name` prop, using the `getInitials` function.
	 *
	 * The initials are displayed when there is no image.
	 */
	initials?: string;
	/** Specify a string to be used instead of the name, to determine which color to use when color="colorful". Use this when a name is not available, but there is another unique identifier that can be used instead. */
	idForColor?: string;
	/** Icon to be displayed when the avatar doesn't have an image or initials. */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The badge to display as a status indicator. (you can use with a custom icon) */
	badge?: BadgePresence & {
		/** Set a custom badge. */
		icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	};
} & PolymorphicProps<'div'>;
