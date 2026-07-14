import type { PolymorphicProps, Shapes } from '$types';

export type SkeletonTags = 'div' | 'span';

export type SkeletonProps<Tag extends SkeletonTags = 'div'> = {
	/** The HTML element type of the skeleton. */
	as: Tag;
	/** The animation type of the skeleton. */
	animation?: 'wave' | 'pulse';
	/** The shape of the skeleton. */
	shape?: Shapes;
	/** Whether to justify the skeleton. */
	justify?: boolean;
	/** Get the DOM reference of the skeleton element. */
	ref?: HTMLElement;
} & PolymorphicProps<Tag>;
