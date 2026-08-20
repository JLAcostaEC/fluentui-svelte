import type { Component, Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import type { BeforeOrAfter, Colors, PolymorphicProps, Shapes, Statuses, Variants } from '$types';

/** @propsmith BadgeProps */
export type BadgeProps = {
	/** The size of the badge in pixels.
	 * @default 20
	 */
	size?: number;
	/** The badge can have a circular, rounded or square shape.
	 * @default 'circular'
	 */
	shape?: Shapes;
	/** The badge can have its background and border styled for greater emphasis or to be subtle.
	 * @default 'filled'
	 */
	appearance?: Variants;
	/** The position of the icon relative to the badge content.
	 * @default 'before'
	 */
	iconPosition?: BeforeOrAfter;
	/** The color of the badge. For now it only supports system colors.
	 * @default 'information'
	 */
	color?: Colors;
	/** Icon to render inside the badge.
	 * @type Snippet | Component
	 */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The DOM reference of the badge element.
	 * @bindable
	 */
	ref?: HTMLSpanElement;
} & PolymorphicProps<'span'>;

/** The presence of a person, rendered by BadgeIcon on its own or by an Avatar through its badge prop. */
export type BadgePresence = {
	/** The presence status to display.
	 * @default 'available'
	 */
	status?: Statuses;
	/** Decorates the presence icon to signal that the person is out of office.
	 * @default false
	 */
	outOfOffice?: boolean;
};

/** @propsmith BadgeIconProps */
export type BadgeIconProps = {
	/** The presence status to display. It picks both the icon and the color of the badge.
	 * @default 'available'
	 */
	status?: Statuses;
	/** Decorates the presence icon to signal that the person is out of office.
	 * @default false
	 */
	outOfOffice?: boolean;
	/** The size of the badge in pixels.
	 * @default 20
	 */
	size?: number;
	/** Overrides the color the status would pick on its own. */
	color?: Colors;
	/** Custom icon, rendered instead of the one the status would pick on its own.
	 * @type Snippet | Component
	 */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The DOM reference of the badge element.
	 * @bindable
	 */
	ref?: HTMLSpanElement;
} & Omit<PolymorphicProps<'span'>, 'children'>;
