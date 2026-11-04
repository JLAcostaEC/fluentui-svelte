import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { FSContext } from '#internal';
import type { PolymorphicProps } from '#types';
import type { ListViewItemBranchProps, ListViewItemDOM, ListViewItemProps, ListViewProps } from '../list-view/types.ts';

export type SideNavRenderState = { collapsed: boolean; floating: boolean };
export type SideNavContent = string | Snippet<[SideNavRenderState]> | Component<SideNavRenderState>;
export type SideNavListViewProps = Omit<ListViewProps<'ul'>, 'children' | 'ref' | 'selectedItems'>;

/** @propsmith SideNavProps */
export type SideNavProps = {
	/** The DOM reference of the navigation landmark.
	 * @bindable
	 */
	ref?: HTMLElement | null;
	/** The accessible name of the navigation landmark.
	 * @default 'Main navigation'
	 */
	label?: string;
	/** Shows an icon rail when docked, or only the toggle when floating.
	 * @default false
	 * @bindable
	 */
	collapsed?: boolean;
	/** The side of the window the navigation is on. It mirrors in right-to-left layouts, and AppSurface rounds the corners that face it.
	 * @default 'left'
	 */
	position?: 'left' | 'right';
	/** Whether the navigation shows its own hamburger toggle. By default it hides it when the title bar of its window has a global navigation button, which then controls the navigation. Set it to true to keep both, or to false to control the navigation yourself.
	 * @default Automatic
	 */
	showToggle?: boolean;
	/** Overlays the content of a positioned parent instead of taking layout space. The overlay is non-modal.
	 * @default false
	 */
	floating?: boolean;
	/** The expanded width. Numbers are pixels converted to rem; strings are CSS lengths.
	 * @default 200
	 */
	width?: number | string;
	/** The accessible label of the toggle while collapsed.
	 * @default 'Expand navigation'
	 */
	expandLabel?: string;
	/** The accessible label of the toggle while expanded.
	 * @default 'Collapse navigation'
	 */
	collapseLabel?: string;
	/** Closes a floating panel after activating a SideNavItem.
	 * @default true
	 */
	closeOnSelect?: boolean;
	/** Called when the user expands or collapses the navigation. */
	onCollapsedChange?: (event: Event, collapsed: boolean) => void;
	/** The selection shared by every list in the navigation. Selection is off by default.
	 * @bindable
	 */
	selectedItems?: string[];
	/** Overrides the defaults of every list in the navigation, the main one, the footer and the ones inside a SideNavBranch: native list semantics, no selection and one tab stop per item.
	 * @type SideNavListViewProps
	 */
	listViewProps?: SideNavListViewProps;
	/** The text heading beside the hamburger button. Hidden in the compact rail. */
	header?: string;
	/** Custom content between the hamburger section and the list. Text, snippets and components are supported. Renderers receive collapsed and floating; strings are hidden in the compact rail.
	 * @type string | Snippet | Component
	 */
	topContent?: SideNavContent;
	/** Custom content after the scrolling list and before the pinned footer. Text, snippets and components are supported. Renderers receive collapsed and floating; strings are hidden in the compact rail.
	 * @type string | Snippet | Component
	 */
	footerContent?: SideNavContent;
	/** Footer list items pinned to the bottom, outside the main list's scroll area. */
	footer?: Snippet;
	/** Main navigation items. Use SideNavItem and SideNavBranch. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

/** @propsmith SideNavItemProps */
export type SideNavItemProps<T extends 'li' | 'a' | 'button' | 'div' = 'a'> = {
	/** The HTML tag. Links are the default; use button for actions and li or div for custom controls.
	 * @type 'li' | 'a' | 'button' | 'div'
	 * @default 'a'
	 */
	as?: T;
	/** The DOM reference of the item.
	 * @type HTMLLIElement | HTMLAnchorElement | HTMLButtonElement | HTMLDivElement
	 * @bindable
	 */
	ref?: ListViewItemDOM[T] | null;
	/** The accessible label, also used as visible content when children are absent. */
	label: string;
	/** The decorative icon shown in both expanded and collapsed modes.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** Optional item markup, following ListViewItem. The label is rendered when children are absent. */
	children?: Snippet;
} & Pick<ListViewItemProps, 'shape' | 'value' | 'active' | 'role' | 'disabled' | 'checkmark' | 'onAction' | 'onfocus'> &
	PolymorphicProps<T, 'children' | 'ref' | 'onfocus'>;

/** @propsmith SideNavBranchProps */
export type SideNavBranchProps = {
	/** The accessible label of the disclosure button. In the compact rail, its initial stands in when there is no icon. */
	label: string;
	/** The decorative icon before the label.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** Whether the nested items are visible. Branches only expand or collapse and are never selectable. The compact rail reports a branch as collapsed, and opens the navigation when one is pressed.
	 * @default false
	 * @bindable
	 */
	expanded?: boolean;
	/** Called when a user expands or collapses the branch. */
	onExpandedChange?: (e: Event, expanded: boolean) => void;
	/** Disables the disclosure button.
	 * @default false
	 */
	disabled?: boolean;
	/** The DOM reference of the native disclosure button. Additional HTML attributes, including class and id, also target this button.
	 * @type HTMLButtonElement
	 * @bindable
	 */
	ref?: HTMLButtonElement | null;
	/** The DOM reference of the wrapper element, the list item that holds the button and the nested list.
	 * @type HTMLLIElement | HTMLDivElement
	 * @bindable
	 */
	wrapperRef?: HTMLLIElement | HTMLDivElement | null;
	/** The attributes to spread on the wrapper element.
	 * @type HTMLAttributes
	 */
	wrapperAttributes?: HTMLAttributes<HTMLLIElement | HTMLDivElement>;
	/** The disclosure button shape. Inherited from the list by default. */
	shape?: ListViewItemBranchProps['shape'];
	/** The nested SideNavItem and SideNavBranch content. */
	children?: Snippet;
} & Omit<HTMLButtonAttributes, 'children' | 'role' | 'type' | 'value' | 'aria-expanded' | 'aria-controls'>;

export type SideNavContext = FSContext<
	{ readonly floating: boolean; readonly listViewProps: SideNavListViewProps | undefined },
	{ readonly collapsed: boolean; readonly compact: boolean; selectedItems: string[] },
	null,
	{ setCollapsed: (event: Event, collapsed: boolean) => void; activate: (event: Event) => void }
>;
