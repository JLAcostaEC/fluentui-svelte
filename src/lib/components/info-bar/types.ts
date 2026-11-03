import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/** @propsmith InfoBarProps */
export type InfoBarProps = {
	/** The severity of the message, which picks the icon and the colors.
	 * @default 'information'
	 */
	status?: 'information' | 'attention' | 'warning' | 'critical' | 'success';
	/** Lays the message out on a single line, or stacked below the title.
	 * @default 'inline'
	 */
	style?: 'inline' | 'multiline';
	/** The title of the InfoBar. */
	title?: string;
	/** The level of the heading that holds the title, to fit the headings of the page around it.
	 * @default 3
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Custom icon, rendered instead of the one the `status` would pick on its own.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** The size of the icon in pixels.
	 * @default 20
	 */
	iconSize?: number;
	/** Removes the button that dismisses the InfoBar. */
	hideCloseButton?: boolean;
	/** The message of the InfoBar. */
	children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;
