import type { AriaAttributes, SvelteHTMLElements } from 'svelte/elements';

export type NoUndefinedField<T> = {
	[P in keyof T]-?: P extends Record<P, infer V> ? NoUndefinedField<NonNullable<V>> : NonNullable<T[P]>;
};

/** Omits all keys from `T` whose name starts with the prefix `K`. */
export type OmitByWord<T, K extends string> = {
	[P in keyof T as P extends `${K}${string}` ? never : P]: T[P];
};

/** Picks only the keys from `T` whose name starts with the prefix `K`. */
export type PickByWord<T, K extends string> = {
	[P in keyof T as P extends `${K}${string}` ? P : never]: T[P];
};

export type Sizes = 'small' | 'medium' | 'large';
export type Shapes = 'circular' | 'rounded' | 'square';
export type Appearances = 'accent' | 'standard' | 'subtle';
export type Variants = 'filled' | 'outline' | 'ghost' | 'tint';
export type Colors = 'information' | 'attention' | 'warning' | 'success' | 'critical';
export type BeforeOrAfter = 'before' | 'after';
export type ActiveOrInactive = 'active' | 'inactive';
export type Statuses =
	'available' | 'busy' | 'offline' | 'away' | 'do-not-disturb' | 'out-of-office' | 'unknown' | 'blocked';
export type ProgressStatus = 'paused' | 'error';
export type YAxis = 'top' | 'bottom';
export type XAxis = 'left' | 'right';
export type YDirection = 'up' | 'middle' | 'down';
export type XDirection = 'start' | 'center' | 'end';
export type EASING = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/** Props for a polymorphic component that can render different HTML elements.
 * This remove "on:" and "aria" attributes due to "Expression produces a union type that is too complex to represent." error when using SvelteHTMLElements type.
 * Then we add the AriaAttributes back and we no longer have the error
 * @see https://github.com/sveltejs/svelte/issues/16046
 * @see https://github.com/sveltejs/svelte/issues/16839
 */
export type PolymorphicProps<T extends keyof SvelteHTMLElements> = OmitByWord<SvelteHTMLElements[T], 'on:' | 'aria'> &
	AriaAttributes;
