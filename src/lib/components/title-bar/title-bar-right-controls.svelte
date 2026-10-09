<script lang="ts">
	import { Avatar, Button } from '$lib/index.js';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import SquareMultipleRegular from 'fluentui-icons-svelte/SquareMultipleRegular.svelte';
	import SquareRegular from 'fluentui-icons-svelte/SquareRegular.svelte';
	import SubtractRegular from 'fluentui-icons-svelte/SubtractRegular.svelte';
	import { requireTitleBarContext } from './title-bar.ts';
	import type { TitleBarRightControlsProps } from './types.ts';

	let {
		ref = $bindable(),
		hideMinimize = false,
		hideWindowToggle = false,
		hideClose = false,
		maximized = false,
		onMinimize,
		onWindowToggle,
		onClose,
		minimizeLabel = 'Minimize',
		maximizeLabel = 'Maximize',
		restoreLabel = 'Restore',
		closeLabel = 'Close',
		personPic,
		onPersonPicClick,
		customMenu,
		class: classes,
		...attributes
	}: TitleBarRightControlsProps = $props();

	const context = requireTitleBarContext();

	const tabindex = $derived(context.config.tabbable ? undefined : -1);

	const windowToggleLabel = $derived(maximized ? restoreLabel : maximizeLabel);
	const hasActions = $derived(!!(customMenu || personPic));
	const hasWindowControls = $derived(!(hideMinimize && hideWindowToggle && hideClose));
</script>

<!--
	@component
	The controls at the end of a `TitleBar`: custom menus, the picture of the person, and the minimize, maximize and close
	buttons of the window. The window buttons only report the press, since moving the window is up to the host of your app.
	It must be rendered inside a `TitleBar`, which it reads its context from.

	- Usage:
	```tsx
	<script>
		import { TitleBar, TitleBarRightControls } from 'fluentui-svelte';
	</script>

	<TitleBar>
		{#snippet rightControls()}
			<TitleBarRightControls
				personPic={{ name: 'Ada Lovelace' }}
				onMinimize={() => appWindow.minimize()}
				onWindowToggle={() => appWindow.toggleMaximize()}
				onClose={() => appWindow.close()}
			/>
		{/snippet}
	</TitleBar>
	```
-->
<div bind:this={ref} class={['fs-title-bar-right-controls', classes]} {...attributes}>
	{#if hasActions}
		<div class="fs-title-bar-actions">
			{@render customMenu?.()}
			{#if personPic}
				{#if onPersonPicClick}
					<Button
						class="fs-title-bar-person-pic"
						appearance="subtle"
						shape="circular"
						{tabindex}
						onclick={onPersonPicClick}
					>
						<Avatar size={24} {...personPic} />
					</Button>
				{:else}
					<Avatar size={24} {...personPic} />
				{/if}
			{/if}
		</div>
	{/if}
	{#if hasWindowControls}
		<div class="fs-title-bar-caption-buttons">
			{#if !hideMinimize}
				<Button
					class="fs-title-bar-caption fs-title-bar-caption-minimize"
					appearance="subtle"
					shape="square"
					aria-label={minimizeLabel}
					title={minimizeLabel}
					{tabindex}
					onclick={onMinimize}
				>
					<SubtractRegular aria-hidden="true" />
				</Button>
			{/if}
			{#if !hideWindowToggle}
				<Button
					class="fs-title-bar-caption fs-title-bar-caption-toggle"
					appearance="subtle"
					shape="square"
					aria-label={windowToggleLabel}
					title={windowToggleLabel}
					{tabindex}
					onclick={onWindowToggle}
				>
					{#if maximized}
						<SquareMultipleRegular aria-hidden="true" />
					{:else}
						<SquareRegular aria-hidden="true" />
					{/if}
				</Button>
			{/if}
			{#if !hideClose}
				<Button
					class="fs-title-bar-caption fs-title-bar-caption-close"
					appearance="subtle"
					shape="square"
					aria-label={closeLabel}
					title={closeLabel}
					{tabindex}
					onclick={onClose}
				>
					<DismissRegular aria-hidden="true" />
				</Button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.fs-title-bar-right-controls {
		display: flex;
		align-items: center;
		block-size: 100%;
	}
	.fs-title-bar-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding-inline: 0.5rem;
		& :global(.fs-title-bar-person-pic) {
			padding: 0.25rem;
			background: var(--fs-subtle-fill-transparent);
		}
	}
	/* The window buttons run the full height of the bar, flush with its edge. */
	.fs-title-bar-caption-buttons {
		display: flex;
		align-self: stretch;
		& :global(.fs-title-bar-caption) {
			flex: none;
			inline-size: 2.875rem;
			padding: 0;
			background: var(--fs-subtle-fill-transparent);
			&:focus-visible {
				outline-offset: -0.125rem;
			}
		}
		& :global(.fs-title-bar-caption svg) {
			inline-size: 0.875rem;
			block-size: 0.875rem;
		}
		& :global(.fs-title-bar-caption.fs-title-bar-caption-close:hover),
		& :global(.fs-title-bar-caption.fs-title-bar-caption-close:active) {
			color: var(--fs-text-on-accent-primary);
			background: var(--fs-system-critical);
		}
		& :global(.fs-title-bar-caption.fs-title-bar-caption-close:active) {
			background: color-mix(in srgb, var(--fs-system-critical) 80%, transparent);
		}
	}
</style>
