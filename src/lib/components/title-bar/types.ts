import type { Component, Snippet } from 'svelte';
import type { HTMLAttributes, MouseEventHandler, SVGAttributes } from 'svelte/elements';
import type { FSContext } from '$internal';
import type { AvatarProps } from '../avatar/type.ts';

export type TitleBarContext = FSContext<
	{
		readonly tabbable: boolean;
		readonly dragRegionProps?: HTMLAttributes<HTMLElement>;
	},
	null,
	null,
	null
>;

/** @propsmith TitleBarProps */
export type TitleBarProps = {
	/** The DOM reference of the title bar element.
	 * @bindable
	 */
	ref?: HTMLElement;
	/** The controls at the start of the bar: back, navigation, and the identity of the app. Render a `TitleBarLeftControls` here, which only works inside a `TitleBar`.
	 * @type Snippet
	 */
	leftControls?: Snippet;
	/** The search at the center of the bar, which grows and shrinks with the window between `searchMinWidth` and `searchMaxWidth`.
	 * @type Snippet
	 */
	search?: Snippet;
	/** The controls at the end of the bar: custom menus, the person picture, and the window buttons. Render a `TitleBarRightControls` here, which only works inside a `TitleBar`.
	 * @type Snippet
	 */
	rightControls?: Snippet;
	/** Uses the tall bar, which leaves a search room to breathe. It is on by default when `search` is provided.
	 */
	tall?: boolean;
	/** The narrowest the search gets while the window shrinks. A number is in pixels, a string is any CSS length.
	 * @default 200
	 */
	searchMinWidth?: number | string;
	/** The widest the search gets while the window grows. A number is in pixels, a string is any CSS length.
	 * @default 480
	 */
	searchMaxWidth?: number | string;
	/** Collapses the search into a button. Pressing the button expands the search again and moves the focus into it.
	 * @default false
	 * @bindable
	 */
	searchCollapsed?: boolean;
	/** The accessible name of the button that stands in for a collapsed search.
	 * @default 'Search'
	 */
	searchLabel?: string;
	/** Lets the Tab key reach the buttons of the bar, which are skipped by default, as the buttons of a window title bar are. They can still be pressed and focused with the pointer. The content you render in the snippets is not affected.
	 * @default false
	 */
	tabbable?: boolean;
	/** The attributes that make the bar draggable for the host that moves the window, such as `data-tauri-drag-region` for Tauri.
	 * They are spread on the bar and on its start and end areas.
	 * @type HTMLAttributes
	 */
	dragRegionProps?: HTMLAttributes<HTMLElement>;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

/** @propsmith TitleBarLeftControlsProps */
export type TitleBarLeftControlsProps = {
	/** The DOM reference of the controls element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** Shows the back button.
	 * @default false
	 */
	back?: boolean;
	/** Disables the back button, for when there is nowhere to go back to.
	 * @default false
	 */
	backDisabled?: boolean;
	/** Called when the back button is pressed. */
	onBack?: MouseEventHandler<HTMLButtonElement>;
	/** The accessible name of the back button.
	 * @default 'Back'
	 */
	backLabel?: string;
	/** Shows the global navigation button, or replaces it with the snippet you provide.
	 * @type boolean | Snippet
	 * @default false
	 */
	globalNav?: boolean | Snippet;
	/** Whether the navigation the global navigation button controls is expanded.
	 * @default false
	 */
	globalNavExpanded?: boolean;
	/** Called when the global navigation button is pressed. */
	onGlobalNav?: MouseEventHandler<HTMLButtonElement>;
	/** The accessible name of the global navigation button.
	 * @default 'Navigation menu'
	 */
	globalNavLabel?: string;
	/** The icon of the app: the URL of an image, an icon component, or a snippet that draws a custom SVG.
	 * @type string | Snippet | Component
	 */
	appIcon?: string | Snippet<[SVGAttributes<SVGElement>]> | Component<SVGAttributes<SVGElement>>;
	/** The name of the app. */
	appName?: string;
	/** The release status of the app, such as `PREVIEW` or `BETA`.
	 * @type string | Snippet
	 */
	releaseTag?: string | Snippet;
	/** More content after the release tag, such as a subtitle.
	 * @type Snippet
	 */
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** @propsmith TitleBarRightControlsProps */
export type TitleBarRightControlsProps = {
	/** The DOM reference of the controls element.
	 * @bindable
	 */
	ref?: HTMLDivElement;
	/** Hides the minimize button.
	 * @default false
	 */
	hideMinimize?: boolean;
	/** Hides the maximize and restore button.
	 * @default false
	 */
	hideWindowToggle?: boolean;
	/** Hides the close button.
	 * @default false
	 */
	hideClose?: boolean;
	/** Whether the window is maximized, which turns the maximize button into a restore button.
	 * @default false
	 */
	maximized?: boolean;
	/** Called when the minimize button is pressed. */
	onMinimize?: MouseEventHandler<HTMLButtonElement>;
	/** Called when the maximize or restore button is pressed. */
	onWindowToggle?: MouseEventHandler<HTMLButtonElement>;
	/** Called when the close button is pressed. */
	onClose?: MouseEventHandler<HTMLButtonElement>;
	/** The accessible name of the minimize button.
	 * @default 'Minimize'
	 */
	minimizeLabel?: string;
	/** The accessible name of the maximize button.
	 * @default 'Maximize'
	 */
	maximizeLabel?: string;
	/** The accessible name of the restore button.
	 * @default 'Restore'
	 */
	restoreLabel?: string;
	/** The accessible name of the close button.
	 * @default 'Close'
	 */
	closeLabel?: string;
	/** The props of the `Avatar` that shows the person. Its size is 24 unless you set one.
	 * @type AvatarProps
	 */
	personPic?: AvatarProps;
	/** Called when the person picture is pressed, which turns it into a button.  */
	onPersonPicClick?: MouseEventHandler<HTMLButtonElement>;
	/** The custom menus or actions placed before the person picture.
	 * @type Snippet
	 */
	customMenu?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
