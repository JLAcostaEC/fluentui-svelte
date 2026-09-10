import type { Horientation, PolymorphicProps } from '$types';
import type { FSContext } from '$internal';
import type { HTMLAttributes } from 'svelte/elements';
import type { Component, Snippet } from 'svelte';

export type CardProps<Tag extends CardTagTypes = 'div'> = {
	ref?: refType[Tag];
	as?: Tag;
	orientation?: Horientation;
	selectable?: boolean;
	showFloatingAction?: boolean;
	id?: string;
	selected?: boolean;
	disabled?: boolean;
	appearance?: 'filled' | 'outlined' | 'subtle';
	onSelectionChange?: (id: string, selected: boolean) => void;
} & PolymorphicProps<Tag>;

export type CardTagTypes = 'div' | 'article' | 'section' | 'a';

export type refType = {
	div: HTMLDivElement;
	article: HTMLElement;
	section: HTMLElement;
	a: HTMLAnchorElement;
};

export type CardContext = FSContext<
	{
		readonly as?: CardTagTypes;
		readonly showFloatingAction?: boolean;
		readonly appearance?: 'filled' | 'outlined' | 'subtle';
		readonly selectable?: boolean;
		readonly id?: string;
	},
	{
		orientation?: Horientation;
		selected?: boolean;
		disabled?: boolean;
	},
	null,
	{
		handleAction?: (e: MouseEvent) => void;
	}
>;

export type CardPreviewProps = {
	ref?: HTMLDivElement;
	logoSrc: string;
} & HTMLAttributes<HTMLDivElement>;

export type CardHeaderProps = {
	ref?: HTMLDivElement;
	title: Snippet<[attrs: { id: string }]> | Component<{ id: string }> | string;
	image?: Snippet | Component | string;
	description?: Snippet | Component | string;
	action?: Snippet | Component;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>;

export type CardFooterProps = {
	ref?: HTMLDivElement;
	action?: Snippet | Component;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
