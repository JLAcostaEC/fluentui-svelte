import type { FSContext } from '$internal';
import type { Snippet, Component } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

/** How every tab of the strip takes its width. */
export type TabWidthMode = 'equal' | 'size-to-content' | 'compact';

export type TabViewContext = FSContext<
	{
		closable: boolean;
		tabWidthMode: TabWidthMode;
	},
	{
		activeTab: string;
	},
	null,
	{
		setActiveTab: (event: Event, value: string) => void;
		closeTab: (event: Event, value: string) => void;
	}
>;

/** @propsmith TabViewProps */
export type TabViewProps = {
	/** The DOM reference of the element wrapping the strip.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The DOM reference of the tab list.
	 * @bindable
	 */
	listRef?: HTMLDivElement;
	/** The props to spread on the tab list element, where the `tablist` role and its label belong.
	 * @type HTMLAttributes
	 */
	listProps?: HTMLAttributes<HTMLDivElement>;
	/** The value of the selected tab.
	 * @bindable
	 */
	activeTab?: string;
	/** Fired when the selected tab changes. */
	onTabChange?: (event: Event, value: string) => void;
	/** Every tab shows a close button, unless the tab opts out of it.
	 * @default false
	 */
	closable?: boolean;
	/** Fired when a tab asks to be closed. Removing the tab is left to the consumer. */
	onTabClose?: (event: Event, value: string) => void;
	/** Shows the button that adds a new tab at the end of the strip.
	 * @default false
	 */
	showNewTabButton?: boolean;
	/** Fired when the new tab button is activated. */
	onNewTab?: (event: MouseEvent) => void;
	/** The props to spread on the new tab button.
	 * @type HTMLButtonAttributes
	 */
	newTabButtonProps?: HTMLButtonAttributes;
	/** How the tabs take their width: sharing the strip evenly, sizing to their own content, or
	 * shrinking to the icon of every tab but the selected one.
	 * @default 'equal'
	 */
	tabWidthMode?: TabWidthMode;
	/** Opts the strip out of the tabspot focus management, to wire your own.
	 * @default false
	 */
	disableTabspot?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/** @propsmith TabViewTabProps */
export type TabViewTabProps = {
	/** The DOM reference of the tab element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** The value that identifies the tab. Defaults to a generated id. */
	value?: string;
	/** The icon to display before the label.
	 * @type Snippet | Component
	 */
	icon?: Snippet | Component;
	/** Shows the close button of the tab. Falls back to the `closable` of the strip. */
	closable?: boolean;
	/** Disables the user interaction. */
	disabled?: boolean;
	/** Fired when the tab asks to be closed, either from its close button or the `Delete` key. */
	onClose?: (event: Event, value: string) => void;
} & HTMLAttributes<HTMLDivElement>;
