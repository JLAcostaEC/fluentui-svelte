import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type InfoBarProps = {
	/** The status of the InfoBar. */
	status?: 'information' | 'attention' | 'warning' | 'critical' | 'success';
	/** The style of the InfoBar. */
	style?: 'inline' | 'multiline';
	/** The title of the InfoBar. */
	title?: string;
	/** The icon to display in the InfoBar. */
	icon?: Snippet | Component;
	/** The action button to display in the InfoBar. */
	hideCloseButton?: boolean;
	iconSize?: number;
	children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;
