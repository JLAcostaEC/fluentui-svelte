import type { EventListeners, OverlayScrollbars, PartialOptions } from 'overlayscrollbars';
import type { HTMLAttributes } from 'svelte/elements';
import type { PolymorphicProps } from '#types';

/** @propsmith ScrollBarProps */
export type ScrollBarProps<Tag extends ScrollBarGenerics = 'div'> = {
	/** The element to render.
	 * @type 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'ul' | 'ol'
	 * @default 'div'
	 */
	as?: Tag;
	/** The root element.
	 * @type HTMLElement
	 * @bindable
	 */
	ref?: HTMLElement | null;
	/** An existing element to add the scroll bars to instead of rendering one. */
	scrollRef?: HTMLElement | null;
	/** The element that scrolls.
	 * @bindable
	 */
	viewportRef?: HTMLElement | null;
	/** Attributes for the element that scrolls. */
	viewportAttributes?: HTMLAttributes<HTMLDivElement>;
	/** Keeps the scroll bar expanded. */
	expanded?: boolean;
	/** Milliseconds to wait before collapsing after the pointer leaves.
	 * @default 2000
	 */
	collapseDelay?: number;
	/** The OverlayScrollbars instance.
	 * @bindable
	 */
	instance?: OverlayScrollbars | null;
	/** The axes that can scroll.
	 * @default 'auto'
	 */
	overflow?: 'auto' | 'x' | 'y' | 'both';
	/** When the scroll bar hides.
	 * @default 'move'
	 */
	autoHide?: 'never' | 'scroll' | 'leave' | 'move';
	/** Milliseconds to wait before hiding.
	 * @default 1000
	 */
	autoHideDelay?: number;
	/** Hides the arrow buttons. */
	hideArrows?: boolean;
	/** Shows the focus outline of the scrolling area. */
	showFocusOutline?: boolean;
	/** Hides the track. */
	hideTrack?: boolean;
	/** Pixels scrolled per arrow press.
	 * @default 48
	 */
	arrowStep?: number;
	/** Extra OverlayScrollbars options. */
	options?: PartialOptions;
	/** OverlayScrollbars events. */
	events?: EventListeners;
	/** Initializes when the browser is idle. */
	defer?: boolean | IdleRequestOptions;
} & PolymorphicProps<Tag>;

export type ScrollBarGenerics = 'div' | 'section' | 'article' | 'aside' | 'main' | 'nav' | 'ul' | 'ol';
