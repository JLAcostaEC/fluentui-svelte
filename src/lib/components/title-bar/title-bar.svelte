<script lang="ts">
	import { tick } from 'svelte';
	import { Button } from '$lib/index.js';
	import { pxToRem } from '$internal';
	import SearchRegular from 'fluentui-icons-svelte/SearchRegular.svelte';
	import { setTitleBarContext } from './title-bar.ts';
	import type { TitleBarContext, TitleBarProps } from './types.ts';

	let {
		ref = $bindable(),
		leftControls,
		search,
		rightControls,
		tall,
		searchMinWidth = 200,
		searchMaxWidth = 480,
		searchCollapsed = $bindable(false),
		searchLabel = 'Search',
		tabbable = false,
		dragRegionProps,
		class: classes,
		...attributes
	}: TitleBarProps = $props();

	const FOCUSABLE = 'input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])';

	let searchRef = $state<HTMLDivElement>();

	const hasSearch = $derived(!!search);
	const collapsed = $derived(hasSearch && searchCollapsed);
	const _tall = $derived(tall ?? hasSearch);

	const toLength = (value: number | string) => (typeof value === 'number' ? pxToRem(value) : value);

	const context: TitleBarContext = {
		config: {
			get tabbable() {
				return tabbable;
			},
			get dragRegionProps() {
				return dragRegionProps;
			}
		},
		state: null,
		events: null,
		methods: null
	};

	setTitleBarContext(context);

	const expandSearch = async () => {
		searchCollapsed = false;
		await tick();
		searchRef?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
	};
</script>

<!--
	@component
	A title bar is the top bar of an app shell, laid out like the one of a Windows 11 app: the identity of the app
	and its navigation at the start, a search that grows and shrinks at the center, and the window controls at the end.
	It paints no background of its own, since it sits on the component that renders the window. The controls it holds,
	`TitleBarLeftControls` and `TitleBarRightControls`, must be rendered inside it to read its context.

	- Usage:
	```tsx
	<script>
		import { TitleBar, TitleBarLeftControls, TitleBarRightControls } from 'fluentui-svelte';
	</script>

	<TitleBar>
		{#snippet leftControls()}
			<TitleBarLeftControls appName="FluentUI App" releaseTag="PREVIEW" />
		{/snippet}
		{#snippet rightControls()}
			<TitleBarRightControls onClose={() => window.close()} />
		{/snippet}
	</TitleBar>
	```
-->
<header
	bind:this={ref}
	class={['fs-title-bar', _tall && 'tall', hasSearch && 'has-search', collapsed && 'collapsed', classes]}
	style:--fs-title-bar-search-min={toLength(searchMinWidth)}
	style:--fs-title-bar-search-max={toLength(searchMaxWidth)}
	{...dragRegionProps}
	{...attributes}
>
	<div class="fs-title-bar-left" {...dragRegionProps}>
		{@render leftControls?.()}
	</div>
	{#if search}
		{#if collapsed}
			<div class="fs-title-bar-search">
				<Button
					class="fs-title-bar-search-button"
					appearance="subtle"
					aria-label={searchLabel}
					title={searchLabel}
					tabindex={tabbable ? undefined : -1}
					aria-expanded="false"
					onclick={expandSearch}
				>
					<SearchRegular aria-hidden="true" />
				</Button>
			</div>
		{:else}
			<div class="fs-title-bar-search" bind:this={searchRef}>
				{@render search()}
			</div>
		{/if}
	{/if}
	<div class="fs-title-bar-right" {...dragRegionProps}>
		{@render rightControls?.()}
	</div>
</header>

<style>
	.fs-title-bar {
		--fs-title-bar-height: 2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-sizing: border-box;
		inline-size: 100%;
		block-size: var(--fs-title-bar-height);
		padding-inline-start: 0.5rem;
		color: var(--fs-text-primary);
		font-family: var(--fs-font-family-base);
		font-size: var(--fs-caption-font-size);
		line-height: var(--fs-caption-line-height);
		user-select: none;
		&.tall {
			--fs-title-bar-height: 3rem;
		}
	}
	.fs-title-bar-left,
	.fs-title-bar-right {
		display: flex;
		flex: none;
		align-items: center;
		align-self: stretch;
	}
	/* Without a search, the right controls take the free space ahead of them to sit at the end. */
	.fs-title-bar-right {
		justify-content: flex-end;
		margin-inline-start: auto;
	}
	/*
	 * The search is the one that gives: it shrinks toward its minimum before anything else, and stops
	 * growing at its maximum. What is left over goes to its auto margins, which keeps it centered
	 * between the left and the right controls.
	 */
	.fs-title-bar-search {
		display: flex;
		flex: 1 1 var(--fs-title-bar-search-max);
		align-items: center;
		min-inline-size: var(--fs-title-bar-search-min);
		max-inline-size: var(--fs-title-bar-search-max);
		margin-inline: auto;
		/* The search is stretched to the width the title bar gives it. */
		& > :global(*) {
			flex: 1 1 auto;
			min-inline-size: 0;
		}
		& > :global(.fs-title-bar-search-button) {
			flex: none;
			inline-size: 2.5rem;
			block-size: 2rem;
			padding: 0;
			background: var(--fs-subtle-fill-transparent);
		}
		& :global(.fs-title-bar-search-button svg) {
			inline-size: 1rem;
			block-size: 1rem;
		}
	}
	.fs-title-bar.has-search .fs-title-bar-right {
		margin-inline-start: 0;
	}
	/* A collapsed search is only a button, which sits beside the right controls. */
	.fs-title-bar.collapsed .fs-title-bar-search {
		flex: none;
		min-inline-size: 0;
		max-inline-size: none;
		margin-inline: auto 0;
	}
</style>
