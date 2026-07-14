import type { ComputePositionConfig, VirtualElement } from '@floating-ui/dom';
import type { FSContext } from '$internal';
import type { Component, ComponentProps, Snippet } from 'svelte';
import type { NoUndefinedField } from '$types';
import type { Button } from '../../index.ts';

export type MenuContext = FSContext<
	{ id: string; isSubMenu: boolean; parentHasCheckmarks: boolean; parentHasIcons: boolean } & Omit<
		MenuProps,
		'element' | 'children' | 'onOpenChange' | 'open' | 'onCheckedValueChange' | 'checkedValues'
	>,
	MenuState,
	NoUndefinedField<Pick<MenuProps, 'onCheckedValueChange' | 'onOpenChange'>>,
	{
		toggle: (e: Event) => void;
		open: (e: Event) => void;
		close: (e: Event) => void;
		toggleCheckbox: (e: Event, value: string, name: string) => void;
		toggleRadio: (e: Event, value: string, name: string) => void;
	}
>;

export type MenuState = {
	open: boolean;
	ref: HTMLElement | VirtualElement | null | undefined;
	locked: boolean;
	checkedValues: MenuProps['checkedValues'];
};

export type MenuProps = {
	positionConfig?: Partial<ComputePositionConfig>;
	hasIcons?: boolean;
	hasCheckmarks?: boolean;
	open?: boolean;
	onOpenChange?: (e: Event, open: boolean) => void;
	checkedValues?: Record<string, string[]>;
	onCheckedValueChange?: (e: Event, checkedValues: Record<string, string[]>) => void;
	openOnHover?: boolean;
	openingDelay?: number;
	persistOnItemActivation?: boolean;
	children?: Snippet;
};

export type MenuItemProps = {
	icon?: Snippet<[{ class: string }]> | Component<{ class: string }>;
	secondaryContent?: string;
	disabled?: boolean;
	subText?: string;
	href?: string;
};

export type MenuItemActionableProps = Omit<MenuItemProps, 'href'> &
	ComponentProps<typeof Button<'div'>> & { checked?: boolean; value?: string; name?: string };
