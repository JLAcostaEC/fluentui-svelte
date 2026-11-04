<script lang="ts">
	import { Flyout } from '#lib/index.js';
	import { toLength } from '#internal';
	import { setAppWindowContext } from './app-window.ts';
	import type {
		AppWindowContext,
		AppWindowGlobalNav,
		AppWindowPart,
		AppWindowProps,
		AppWindowSideNav
	} from './types.ts';

	let {
		ref = $bindable(null),
		width = '100%',
		height = '100%',
		active = false,
		maximized = $bindable(false),
		minimized = $bindable(false),
		class: classes,
		style,
		children,
		...attributes
	}: AppWindowProps = $props();

	let sideNav = $state.raw<AppWindowSideNav | null>(null);
	let titleBar = $state.raw<AppWindowPart | null>(null);
	let globalNav = $state.raw<AppWindowGlobalNav | null>(null);
	let appSurface = $state.raw<AppWindowPart | null>(null);

	const context: AppWindowContext = {
		config: {
			get width() {
				return width;
			},
			get height() {
				return height;
			}
		},
		state: {
			get ref() {
				return ref;
			},
			get active() {
				return active;
			},
			get maximized() {
				return maximized;
			},
			get minimized() {
				return minimized;
			},
			get sideNav() {
				return sideNav;
			},
			get titleBar() {
				return titleBar;
			},
			get globalNav() {
				return globalNav;
			},
			get appSurface() {
				return appSurface;
			}
		},
		events: null,
		methods: {
			registerSideNav: (part) => {
				sideNav = part;
				return () => {
					if (sideNav === part) sideNav = null;
				};
			},
			registerTitleBar: (part) => {
				titleBar = part;
				return () => {
					if (titleBar === part) titleBar = null;
				};
			},
			registerGlobalNav: (part) => {
				globalNav = part;
				return () => {
					if (globalNav === part) globalNav = null;
				};
			},
			registerAppSurface: (part) => {
				appSurface = part;
				return () => {
					if (appSurface === part) appSurface = null;
				};
			}
		}
	};
	setAppWindowContext(context);
</script>

<!--
	@component
	An app window is the surface of an app: a Mica window with its own border and a shell shadow that tells whether it is
	the active window. It is a `Flyout` underneath, sized with `width` and `height`, which are `100%` unless you say otherwise.
	Place page content in an `AppSurface` or another scrollable container; the window itself clips overflow.

	- Usage:
	```tsx
	<script>
		import { AppSurface, AppWindow, TitleBar, TitleBarRightControls } from 'fluentui-svelte';
	</script>

	<AppWindow width={480} height={320}>
		<TitleBar>
			{#snippet rightControls()}
				<TitleBarRightControls />
			{/snippet}
		</TitleBar>
		<AppSurface>The content of the app.</AppSurface>
	</AppWindow>
	```
-->
<Flyout
	bind:ref
	class={['fs-app-window', active ? 'active' : 'inactive', classes]}
	style="width: {toLength(width)}; height: {toLength(height)}; {style ?? ''}"
	{...attributes}
>
	{@render children?.()}
</Flyout>

<style>
	/* The window restyles the `Flyout` it is made of, which is why every selector is one class more specific than its own. */
	:global(.fs-flyout.fs-app-window.active),
	:global(.fs-flyout.fs-app-window.inactive) {
		box-sizing: border-box;
		flex-direction: column;
		padding: 0;
		overflow: hidden;
		background: var(--fs-solid-background-base);
		border-color: var(--fs-control-surface-stroke-default);
	}
	:global(.fs-flyout.fs-app-window.active) {
		box-shadow: var(--fs-shell-shadow-active);
	}
	:global(.fs-flyout.fs-app-window.inactive) {
		box-shadow: var(--fs-shell-shadow-inactive);
	}
	/* A direct SideNav and AppSurface share the body row below an optional TitleBar. */
	:global(.fs-flyout.fs-app-window:has(> .fs-side-nav)) {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		grid-template-rows: auto minmax(0, 1fr);
	}
	:global(.fs-flyout.fs-app-window:has(> .fs-side-nav) > .fs-title-bar) {
		grid-column: 1 / -1;
		grid-row: 1;
	}
	:global(.fs-flyout.fs-app-window > .fs-side-nav) {
		grid-column: 1;
		grid-row: 2;
	}
	/* A navigation on the right swaps the columns with the surface. */
	:global(.fs-flyout.fs-app-window:has(> .fs-side-nav.position-right)) {
		grid-template-columns: minmax(0, 1fr) auto;
	}
	:global(.fs-flyout.fs-app-window > .fs-side-nav.position-right) {
		grid-column: 2;
	}
	:global(.fs-flyout.fs-app-window:has(> .fs-side-nav.position-right) > .fs-app-surface) {
		grid-column: 1;
	}
	:global(.fs-flyout.fs-app-window > .fs-side-nav.floating) {
		grid-column: 1 / -1;
	}
	:global(.fs-flyout.fs-app-window:has(> .fs-side-nav) > .fs-app-surface) {
		grid-column: 2;
		grid-row: 2;
		min-inline-size: 0;
	}
	/* Keep server-rendered corners in sync before the parts register during hydration. */
	:global(.fs-flyout.fs-app-window:has(> .fs-side-nav.floating.collapsed) > .fs-app-surface) {
		border-radius: 0;
	}
	/* Mica has no acrylic noise. */
	:global(.fs-flyout.fs-app-window.active::before),
	:global(.fs-flyout.fs-app-window.inactive::before) {
		display: none;
	}
	@media (forced-colors: active) {
		:global(.fs-flyout.fs-app-window.active),
		:global(.fs-flyout.fs-app-window.inactive) {
			background: ButtonFace;
			border-color: GrayText;
		}
	}
</style>
