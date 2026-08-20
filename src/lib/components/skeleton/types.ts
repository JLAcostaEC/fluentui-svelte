import type { PolymorphicProps, Shapes } from '$types';

export type SkeletonTags = 'div' | 'span';

/** @propsmith SkeletonProps */
export type SkeletonProps<Tag extends SkeletonTags = 'div'> = {
	/** The HTML element to render the skeleton as.
	 * @type 'div' | 'span'
	 * @default 'div'
	 */
	as?: Tag;
	/** The animation played while the content is loading.
	 * @default 'wave'
	 */
	animation?: 'wave' | 'pulse';
	/** The skeleton can have a circular, rounded or square shape.
	 * @default 'rounded'
	 */
	shape?: Shapes;
	/** The skeleton is justified to the full width of the container. */
	justify?: boolean;
	/** The DOM reference of the skeleton element.
	 * @bindable
	 */
	ref?: HTMLElement;
} & PolymorphicProps<Tag>;
