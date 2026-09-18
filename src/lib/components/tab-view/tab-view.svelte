<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import AddRegular from 'fluentui-icons-svelte/AddRegular.svelte';
	import { setTabViewContext, TABSPOT_ITEMS, TABSPOT_SKIP } from './tab-view.svelte.ts';
	import type { TabViewContext, TabViewProps } from './types.ts';

	let {
		ref = $bindable(),
		listRef = $bindable(),
		listProps,
		activeTab = $bindable(''),
		onTabChange,
		closable = false,
		onTabClose,
		showNewTabButton = false,
		onNewTab,
		newTabButtonProps,
		tabWidthMode = 'equal',
		disableTabspot = false,
		class: classes,
		children,
		...attributes
	}: TabViewProps = $props();

	const context: TabViewContext = $state({
		config: {
			get closable() {
				return closable;
			},
			get tabWidthMode() {
				return tabWidthMode;
			}
		},
		state: {
			get activeTab() {
				return activeTab;
			},
			set activeTab(value: string) {
				activeTab = value;
			}
		},
		events: null,
		methods: {
			setActiveTab: (event: Event, value: string) => {
				if (activeTab === value) return;
				activeTab = value;
				onTabChange?.(event, value);
			},
			// Which tab takes over — and whether the tab goes at all — is the consumer's call: the
			// tabs are their markup, so only they can remove one.
			closeTab: (event: Event, value: string) => onTabClose?.(event, value)
		}
	});

	setTabViewContext(context);

	/**
	 * A single tab stop for the whole strip: the arrows walk the tabs and `Home`/`End` jump to the
	 * ends. `Escape` is left alone, a tab strip has nothing to exit to.
	 */
	const tabspotAttributes = $derived(
		!disableTabspot &&
			getTabspotAttributes({
				root: { manageSpecialKeys: { Home: true, End: true } },
				mover: { axis: 'horizontal', items: TABSPOT_ITEMS, skip: TABSPOT_SKIP }
			})
	);
</script>

<!--
	@component
	A tab view lays a set of tabs out as a strip, in the shape a browser gives its document tabs.
	It owns the selection alone: what a tab shows is rendered by the consumer, wherever it belongs.

	- Usage:
	```tsx
	<script>
		import { TabView, TabViewTab } from 'fluentui-svelte';

		let activeTab = $state('home');
	</script>

	<TabView bind:activeTab closable showNewTabButton>
		<TabViewTab value="home">Home</TabViewTab>
		<TabViewTab value="about">About</TabViewTab>
	</TabView>

	{#if activeTab === 'home'}
		<p>Home</p>
	{/if}
	```
-->
<div bind:this={ref} class={['fs-tab-view', classes]} {...attributes}>
	<div bind:this={listRef} role="tablist" class="fs-tab-view-list" {...tabspotAttributes} {...listProps}>
		{@render children?.()}
	</div>
	{#if showNewTabButton}
		<button
			type="button"
			class="fs-tab-view-new-tab"
			aria-label="Add new tab"
			onclick={(e: MouseEvent) => onNewTab?.(e)}
			{...newTabButtonProps}
		>
			<AddRegular />
		</button>
	{/if}
</div>

<style>
	.fs-tab-view {
		display: flex;
		/* The tabs grow up from the baseline of the strip, the way a document tab meets its page. */
		align-items: flex-end;
		font-family: var(--fs-font-family-base);
		color: var(--fs-text-primary);
		/* Read by every tab, so a height change ripples out of the root alone. */
		--fs-tab-view-tab-height: 2.25rem;
		/* The radius of the feet the selected tab curves out into, on either side of its base. */
		--fs-tab-view-fillet: 0.4rem;
		& .fs-tab-view-list {
			display: flex;
			align-items: stretch;
			/* Room for the feet of the first and the last tab, which the scroll box would clip. */
			padding-inline: calc(var(--fs-tab-view-fillet, 0.4rem) * 2);
			/* `equal` divides this, and a strip that outgrows it scrolls rather than wrapping. */
			flex: 1 1 auto;
			min-width: 0;
			scrollbar-width: none;
			/*
			 * The hairline that tells one resting tab from the next. A selected or hovered tab draws
			 * an edge of its own, so the line steps aside on either side of it. It lives here rather
			 * than in the tab, which renders one element and so can never see its own sibling.
			 */
			& :global(.fs-tab-view-tab:not(.active):not(:hover) + .fs-tab-view-tab:not(.active):not(:hover)::before) {
				content: '';
				position: absolute;
				inset-inline-start: 0;
				top: 25%;
				bottom: 25%;
				width: 1px;
				background: var(--fs-divider-stroke-default);
			}
		}
		& .fs-tab-view-new-tab {
			position: relative;
			display: flex;
			flex: 0 0 auto;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: var(--fs-tab-view-tab-height);
			margin-inline-start: 0.5rem;
			border: none;
			border-radius: var(--fs-control-border-radius);
			background: transparent;
			color: var(--fs-text-secondary);
			cursor: pointer;
			outline: none;
			&:hover {
				background: var(--fs-subtle-fill-secondary);
				color: var(--fs-text-primary);
			}
			&:active {
				background: var(--fs-subtle-fill-tertiary);
				color: var(--fs-text-secondary);
			}
			&:focus-visible {
				outline: 0.125rem var(--fs-focus-stroke-outer) solid;
				outline-offset: 0.063rem;
			}
			/* The hairline that separates the button from the last tab. */
			&::before {
				content: '';
				position: absolute;
				inset-inline-start: -0.25rem;
				top: 25%;
				bottom: 25%;
				width: 1px;
				background: var(--fs-divider-stroke-default);
			}
			& :global(svg) {
				width: 1rem;
				height: 1rem;
			}
		}
	}
</style>
