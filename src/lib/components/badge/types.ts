import type { Component, Snippet } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';
import type { BeforeOrAfter, Colors, PolymorphicProps, Shapes, Statuses, Variants } from '$types';

export type BadgeProps = {
	/** The size of the badge in PX. */
	size?: number;
	/** The shape of the badge. */
	shape?: Shapes;
	/** The appearance of the badge. */
	appearance?: Variants;
	/** The position of the icon inside the badge. */
	iconPosition?: BeforeOrAfter;
	/** The color of the badge. */
	color?: Colors;
	/** The children elements to render inside the badge. */
	icon?: Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The DOM reference of the badge element. */
	ref?: HTMLSpanElement;
} & PolymorphicProps<'span'>;

export type BadgePresence = {
	status?: Statuses;
	outOfOffice?: boolean;
};

export type BadgeIconProps = Omit<BadgeProps, 'shape' | 'iconPosition' | 'appearance' | 'children'> & BadgePresence;
