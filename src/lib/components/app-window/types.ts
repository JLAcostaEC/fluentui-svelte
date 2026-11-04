import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { FSContext } from '#internal';

export type AppWindowPart = { readonly ref: HTMLElement | null };
export type AppWindowSideNav = AppWindowPart & {
	readonly collapsed: boolean;
	readonly floating: boolean;
	readonly position: 'left' | 'right';
	/** Expands or collapses the navigation, as its own toggle does. */
	setCollapsed: (event: Event, collapsed: boolean) => void;
};
/** The global navigation button of the title bar, which controls the SideNav of the window. */
export type AppWindowGlobalNav = AppWindowPart & { readonly enabled: boolean };

export type AppWindowContext = FSContext<
	{ readonly width: number | string; readonly height: number | string },
	{
		readonly ref: HTMLElement | null;
		readonly active: boolean;
		readonly maximized: boolean;
		readonly minimized: boolean;
		readonly sideNav: AppWindowSideNav | null;
		readonly titleBar: AppWindowPart | null;
		readonly globalNav: AppWindowGlobalNav | null;
		readonly appSurface: AppWindowPart | null;
	},
	null,
	{
		registerSideNav: (part: AppWindowSideNav) => () => void;
		registerTitleBar: (part: AppWindowPart) => () => void;
		registerGlobalNav: (part: AppWindowGlobalNav) => () => void;
		registerAppSurface: (part: AppWindowPart) => () => void;
	}
>;

/** @propsmith AppWindowProps */
export type AppWindowProps = {
	/** The DOM reference of the window element.
	 * @bindable
	 */
	ref?: HTMLElement | null;
	/** The width of the window. A number is in pixels, a string is any CSS length.
	 * @default '100%'
	 */
	width?: number | string;
	/** The height of the window. A number is in pixels, a string is any CSS length.
	 * @default '100%'
	 */
	height?: number | string;
	/** Whether the window is the active one, which picks the shell shadow it casts: a deeper one while active, a lighter one while inactive.
	 * @default false
	 */
	active?: boolean;
	/** The maximized state reported by the host. Shared through AppWindow context and inherited by TitleBarRightControls when its maximized prop is omitted.
	 * @default false
	 * @bindable
	 */
	maximized?: boolean;
	/** The minimized state reported by the host. Shared with window descendants; it does not call a native window API or hide the component.
	 * @default false
	 * @bindable
	 */
	minimized?: boolean;
	/** The content of the window, such as a `TitleBar` and the page below it. */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
