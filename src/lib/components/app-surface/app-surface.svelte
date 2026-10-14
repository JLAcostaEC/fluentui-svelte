<script lang="ts">
	import type { AppSurfaceProps } from './types.ts';

	let {
		ref = $bindable(),
		mode = 'layer',
		active = false,
		class: classes,
		children,
		...attributes
	}: AppSurfaceProps = $props();
</script>

<!--
	@component
	An app surface is the area of an app that holds its content, next to the navigation. It rounds its top-left and
	bottom-right corners, and it is either a `layer` over the window or the `mica` of the window itself, in the colors
	of an active or an inactive window.

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
<div bind:this={ref} class={['fs-app-surface', mode, active ? 'active' : 'inactive', classes]} {...attributes}>
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
		/* Corners can be swapped when the surface is written right to left. */
		border-start-start-radius: var(--fs-control-overlay-border-radius);
		border-end-end-radius: var(--fs-control-overlay-border-radius);
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
