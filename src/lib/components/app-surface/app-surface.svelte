<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getAppWindowContext } from '../app-window/app-window.ts';
	import type { AppSurfaceProps } from './types.ts';

	let {
		ref = $bindable(),
		mode = 'layer',
		active,
		class: classes,
		children,
		...attributes
	}: AppSurfaceProps = $props();

	const appWindow = getAppWindowContext();
	const effectiveActive = $derived(active ?? appWindow?.state.active ?? false);
	const noRadius = $derived(!!appWindow?.state.sideNav?.floating && appWindow.state.sideNav.collapsed);
	const navPosition = $derived(appWindow?.state.sideNav?.position);

	const unregister = appWindow?.methods.registerAppSurface({
		get ref() {
			return ref ?? null;
		}
	});

	onDestroy(() => unregister?.());
</script>

<!--
	@component
	An app surface is the area of an app that holds its content, next to the navigation. It is square on its own;
	next to a `SideNav` it rounds the corner that faces it and the one across from it. It is either a `layer` over the
	window or the `mica` of the window itself, in the colors of an active or an inactive window.

	- Usage:
	```tsx
	<script>
		import { AppSurface, AppWindow } from 'fluentui-svelte';
	</script>

	<AppWindow width={480} height={320}>
		<AppSurface>
			<p>The content of the app.</p>
		</AppSurface>
	</AppWindow>
	```
-->
<div
	bind:this={ref}
	class={[
		'fs-app-surface',
		mode,
		effectiveActive ? 'active' : 'inactive',
		{ 'nav-left': navPosition === 'left', 'nav-right': navPosition === 'right', 'no-radius': noRadius },
		classes
	]}
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	.fs-app-surface {
		box-sizing: border-box;
		flex: 1 1 auto;
		min-block-size: 0;
		overflow: auto;
		color: var(--fs-text-primary);
		background: var(--fs-app-surface-background);
		background-clip: padding-box;
		border: 1px solid var(--fs-app-surface-stroke);
		/* Square unless a SideNav is next to it: then the corner that faces it and the one across from it are rounded. They swap sides with the navigation, and with the writing direction. */
		&.nav-left {
			border-start-start-radius: var(--fs-control-overlay-border-radius);
			border-end-end-radius: var(--fs-control-overlay-border-radius);
		}
		&.nav-right {
			border-start-end-radius: var(--fs-control-overlay-border-radius);
			border-end-start-radius: var(--fs-control-overlay-border-radius);
		}
		&.no-radius {
			border-radius: 0;
		}
		&.layer {
			--fs-app-surface-background: var(--fs-solid-background-tertiary);
			--fs-app-surface-stroke: var(--fs-card-stroke-default);
			&.inactive {
				--fs-app-surface-background: var(--fs-layer-default);
			}
		}
		&.mica {
			--fs-app-surface-background: var(--fs-solid-background-base);
			--fs-app-surface-stroke: var(--fs-control-surface-stroke-default);
		}
	}
</style>
