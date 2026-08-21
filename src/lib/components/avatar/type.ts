import type { Component, Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import type { BadgePresence } from '../badge/types.ts';
import type { ActiveOrInactive, Colors, PolymorphicProps, Shapes } from '$types';

/** @propsmith AvatarProps */
export type AvatarProps = {
	/** The name of the person or entity represented by this Avatar. This should always be provided if it is available.
	 *
	 * The name is used to determine the initials displayed when there is no image. It is also provided to accessibility tools. 
	 * @default 'Avatar'
	 * */
	name?: string;
	/** The Avatar's image */
	image?: {
		src: string;
	};
	/** The DOM reference of the avatar element. 
	 * @bindable
	*/
	ref?: HTMLDivElement;
	/** Size of the avatar in pixels. 
	 * @default 48
	*/
	size?: number;
	/** The avatar can have a circular, rounded or square shape. 
	 * @default 'circular'
	*/
	shape?: Shapes;
	/** The color when displaying either an icon or initials. For now it only supports system colors (plus colorful). 
	 * @default 'attention'
	*/
	color?: Colors | 'colorful';
	/** Optional activity indicator
	 *
	 * `active`: the avatar will be decorated according to activeAppearance
	 *
	 * `inactive`: the avatar will be reduced in size and partially transparent
	 * */
	active?: ActiveOrInactive;
	/** The appearance when `active="active"` 
	 * @default 'ring'
	*/
	activeAppearance?: 'ring' | 'shadow' | 'ring-shadow';
	/** Custom initials by default they will be derived from the `name` prop.
	 *
	 * The initials are displayed when there is no image.
	 * @default name
	 */
	initials?: string;
	/** Specify a string to be used instead of the name, to determine which color to use when color="colorful".*/
	idForColor?: string;
	/** Icon to be displayed when the avatar doesn't have an image or initials. 
	 * @type Snippet | Component
	*/
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The badge to display as a status indicator. (you can use with a custom icon) 
	 * @type BadgePresence
	*/
	badge?: BadgePresence & {
		/** Set a custom badge. */
		icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	};
} & PolymorphicProps<'div'>;
