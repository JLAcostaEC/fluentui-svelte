import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith RatingProps */
export type RatingProps = {
	/** The current rating. Fractions are drawn in quarters until the user rates.
	 * @default 0
	 * @bindable
	 */
	value?: number;
	/** The number of items displayed. Must be a whole number greater than 1.
	 * @default 5
	 */
	max?: number;
	/** The precision of the rating. `0.5` allows half-filled items.
	 * @default 1
	 */
	step?: 1 | 0.5;
	/** The size of the rating items.
	 * @default 'extra-large'
	 */
	size?: 'small' | 'medium' | 'large' | 'extra-large';
	/** The icon of a filled item. Falls back to a filled star. Partially filled items are clipped, so it also works with half steps.
	 * @type Component
	 */
	iconFilled?: Component;
	/** The icon of an empty item. Falls back to an outlined star.
	 * @type Component
	 */
	iconOutline?: Component;
	/** The name of the radio inputs. Generated when not provided. */
	name?: string;
	/** Generates the accessible label of the radio input for a rating value.
	 * @default (rating) => `${rating}`
	 */
	itemLabel?: (rating: number) => string;
	/** Called when the user changes the rating. */
	onChange?: (value: number) => void;
	/** The class to apply to the rating. */
	class?: string;
	/** The DOM reference of the rating element.
	 * @bindable
	 */
	ref?: HTMLElement;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onchange'>;
