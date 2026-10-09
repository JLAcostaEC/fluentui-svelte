<script lang="ts">
	import { Flyout } from '$lib/index.js';
	import { pxToRem } from '$internal';
	import type { AppWindowProps } from './types.ts';

	let {
		ref = $bindable(),
		width = '100%',
		height = '100%',
		active = false,
		class: classes,
		style,
		children,
		...attributes
	}: AppWindowProps = $props();

	const toLength = (value: number | string) => (typeof value === 'number' ? pxToRem(value) : value);
</script>

<!--
	@component
	An app window is the surface of an app: a Mica window with its own border and a shell shadow that tells whether it is
	the active window. It is a `Flyout` underneath, sized with `width` and `height`, which are `100%` unless you say otherwise.

	- Usage:
	```tsx
	<script>
		import { AppWindow, TitleBar, TitleBarRightControls } from 'fluentui-svelte';
	</script>

	<AppWindow width={480} height={320}>
		<TitleBar>
			{#snippet rightControls()}
				<TitleBarRightControls />
			{/snippet}
		</TitleBar>
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
