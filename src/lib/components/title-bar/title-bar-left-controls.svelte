<script lang="ts">
	import { Badge, Button } from '$lib/index.js';
	import { RenderSoC } from '$internal';
	import ArrowLeftRegular from 'fluentui-icons-svelte/ArrowLeftRegular.svelte';
	import NavigationRegular from 'fluentui-icons-svelte/NavigationRegular.svelte';
	import { requireTitleBarContext } from './title-bar.ts';
	import type { TitleBarLeftControlsProps } from './types.ts';

	let {
		ref = $bindable(),
		back = false,
		backDisabled = false,
		onBack,
		backLabel = 'Back',
		globalNav = false,
		globalNavExpanded = false,
		onGlobalNav,
		globalNavLabel = 'Navigation menu',
		appIcon,
		appName,
		releaseTag,
		children,
		class: classes,
		...attributes
	}: TitleBarLeftControlsProps = $props();

	const context = requireTitleBarContext();

	const tabindex = $derived(context.config.tabbable ? undefined : -1);

	const hasIdentity = $derived(!!(appIcon || appName || releaseTag || children));
</script>

<!--
	@component
	The controls at the start of a `TitleBar`: a back button, a global navigation button, and the identity of the app,
	which is its icon, its name and its release tag. It must be rendered inside a `TitleBar`, which it reads its context from.

	- Usage:
	```tsx
	<script>
		import { TitleBar, TitleBarLeftControls } from 'fluentui-svelte';
		import { AppsRegular } from 'fluentui-icons-svelte';
	</script>

	<TitleBar>
		{#snippet leftControls()}
			<TitleBarLeftControls back globalNav appIcon={AppsRegular} appName="FluentUI App" releaseTag="PREVIEW" />
		{/snippet}
	</TitleBar>
	```
-->
<div bind:this={ref} class={['fs-title-bar-left-controls', classes]} {...attributes}>
	{#if back}
		<Button
			class="fs-title-bar-button"
			appearance="subtle"
			aria-label={backLabel}
			title={backLabel}
			{tabindex}
			disabled={backDisabled}
			onclick={onBack}
		>
			<ArrowLeftRegular aria-hidden="true" />
		</Button>
	{/if}
	{#if typeof globalNav === 'function'}
		{@render globalNav()}
	{:else if globalNav}
		<Button
			class="fs-title-bar-button"
			appearance="subtle"
			aria-label={globalNavLabel}
			title={globalNavLabel}
			{tabindex}
			aria-expanded={globalNavExpanded}
			onclick={onGlobalNav}
		>
			<NavigationRegular aria-hidden="true" />
		</Button>
	{/if}
	{#if hasIdentity}
		<div class="fs-title-bar-identity">
			{#if appIcon}
				<span class="fs-title-bar-app-icon" aria-hidden="true">
					{#if typeof appIcon === 'string'}
						<img src={appIcon} alt="" />
					{:else}
						<RenderSoC SoC={appIcon} />
					{/if}
				</span>
			{/if}
			{#if appName}
				<span class="fs-title-bar-app-name">{appName}</span>
			{/if}
			{#if releaseTag}
				<Badge class="fs-title-bar-release-tag" appearance="outline" shape="rounded" size={14}>
					{#if typeof releaseTag === 'string'}
						{releaseTag}
					{:else}
						{@render releaseTag()}
					{/if}
				</Badge>
			{/if}
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.fs-title-bar-left-controls {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		block-size: 100%;
		& :global(.fs-title-bar-button) {
			flex: none;
			inline-size: 2.5rem;
			block-size: 2rem;
			padding: 0;
			background: var(--fs-subtle-fill-transparent);
		}
		& :global(.fs-title-bar-button svg) {
			inline-size: 1rem;
			block-size: 1rem;
		}
	}
	.fs-title-bar-identity {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		/* Breathing room after the buttons, and from the edge of the bar when there are none. */
		padding-inline: 0.25rem;
		/* The wrapper alone carries the drag region, so what sits in it lets the pointer through to it. */
		& .fs-title-bar-app-icon,
		& .fs-title-bar-app-name,
		& :global(.fs-title-bar-release-tag) {
			pointer-events: none;
		}
	}
	.fs-title-bar-app-icon {
		display: inline-flex;
		flex: none;
		& :global(svg),
		& img {
			inline-size: 1rem;
			block-size: 1rem;
			object-fit: contain;
		}
	}
	.fs-title-bar-app-name {
		flex: none;
		max-inline-size: 16rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--fs-text-primary);
	}
	/* Repeats the classes of the badge, since its own color rules are more specific than a single one. */
	.fs-title-bar-identity :global(.fs-badge.fs-title-bar-release-tag.outline) {
		flex: none;
		padding-block: 0;
		padding-inline: 0.1875rem;
		font-size: 0.5625rem;
		line-height: 1;
		font-weight: 400;
		color: var(--fs-text-secondary);
		background: var(--fs-control-alt-fill-quaternary);
		border-color: var(--fs-card-stroke-default);
	}
</style>
