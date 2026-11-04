<script lang="ts">
	import { onDestroy } from 'svelte';
	import { onClickOutside } from 'runed';
	import NavigationRegular from 'fluentui-icons-svelte/NavigationRegular.svelte';
	import Button from '../button/button.svelte';
	import { getAppWindowContext } from '../app-window/app-window.ts';
	import { invokeHandlers, RenderSoC, toLength } from '#internal';
	import { PREFIX } from '#constants';
	import SideNavList from './side-nav-list.svelte';
	import { setSideNavContext } from './side-nav.ts';
	import type { SideNavContent, SideNavContext, SideNavProps } from './types.ts';

	const FALLBACK_ID = $props.id();
	const COMPONENT_NAME = 'side-nav';
	const BODY_ID = `${PREFIX}-${COMPONENT_NAME}-${FALLBACK_ID}`;

	let {
		ref = $bindable(null),
		label = 'Main navigation',
		collapsed = $bindable(false),
		position = 'left',
		showToggle,
		floating = false,
		width = 200,
		expandLabel = 'Expand navigation',
		collapseLabel = 'Collapse navigation',
		closeOnSelect = true,
		onCollapsedChange,
		selectedItems = $bindable([]),
		listViewProps,
		header,
		topContent,
		footerContent,
		footer,
		children,
		onkeydown,
		onfocusout,
		class: classes,
		...attributes
	}: SideNavProps = $props();

	let toggleRef = $state<HTMLButtonElement | null>(null);

	/** Docked, a collapsed navigation is a rail of icons. Floating, it is only the toggle. */
	const compact = $derived(collapsed && !floating);
	const toggleLabel = $derived(collapsed ? expandLabel : collapseLabel);

	function setCollapsed(event: Event, value: boolean) {
		if (collapsed === value) return;
		collapsed = value;
		onCollapsedChange?.(event, value);
	}

	const context: SideNavContext = {
		config: {
			get floating() {
				return floating;
			},
			get listViewProps() {
				return listViewProps;
			}
		},
		state: {
			get collapsed() {
				return collapsed;
			},
			get compact() {
				return compact;
			},
			get selectedItems() {
				return selectedItems;
			},
			set selectedItems(value) {
				selectedItems = value;
			}
		},
		events: null,
		methods: {
			setCollapsed,
			activate: (event) => {
				if (floating && closeOnSelect && !event.defaultPrevented) setCollapsed(event, true);
			}
		}
	};
	setSideNavContext(context);

	const appWindow = getAppWindowContext();
	// The global navigation button of the title bar controls the navigation, and takes the place of its own toggle.
	const globalNav = $derived(appWindow?.state.globalNav);
	const toggleVisible = $derived(showToggle ?? !globalNav?.enabled);
	const unregister = appWindow?.methods.registerSideNav({
		get ref() {
			return ref;
		},
		get collapsed() {
			return collapsed;
		},
		get floating() {
			return floating;
		},
		get position() {
			return position;
		},
		setCollapsed
	});
	onDestroy(() => unregister?.());

	// The body of a floating navigation hides when it closes, so the focus moves to the button that opens it first.
	$effect.pre(() => {
		if (floating && collapsed && ref?.contains(ref.ownerDocument.activeElement)) (toggleRef ?? globalNav?.ref)?.focus();
	});

	/** The button of the title bar that opens and closes the navigation is not outside it: its own click toggles it. */
	const isGlobalNav = (target: EventTarget | null) => target instanceof Node && !!globalNav?.ref?.contains(target);

	// A floating navigation is not modal: it closes with an outside press, with Escape and when the focus leaves it.
	onClickOutside(
		() => ref,
		(event) => {
			if (floating && !collapsed && !isGlobalNav(event.target)) setCollapsed(event, true);
		}
	);

	function handleKeydown(event: KeyboardEvent) {
		// Escape belongs to a nested disclosure or menu first: they cancel it when they handle it.
		if (event.defaultPrevented || !floating || collapsed || event.key !== 'Escape') return;
		event.preventDefault();
		event.stopPropagation();
		setCollapsed(event, true);
	}

	function handleFocusout(event: FocusEvent) {
		const next = event.relatedTarget;
		if (floating && !collapsed && next instanceof Node && !ref?.contains(next) && !isGlobalNav(next))
			setCollapsed(event, true);
	}
</script>

{#snippet region(value?: SideNavContent)}
	{#if value && !(compact && typeof value === 'string')}
		<div class="fs-side-nav-content">
			{#if typeof value === 'string'}
				{value}
			{:else}
				<RenderSoC SoC={value} args={{ collapsed, floating }} />
			{/if}
		</div>
	{/if}
{/snippet}

<!--
	@component
	Collapsible app navigation. Place it directly inside AppWindow next to AppSurface.
	AppWindow handles docked layout and the floating overlay below its title bar.
	Use SideNavItem for links and SideNavBranch for nested navigation.

	- Usage:
	```tsx
	<script>
		import { AppSurface, AppWindow, SideNav, SideNavItem } from 'fluentui-svelte';
		import { HomeRegular } from 'fluentui-icons-svelte';
	</script>

	<AppWindow width={480} height={320}>
		<SideNav header="My app">
			<SideNavItem href="/" label="Home" icon={HomeRegular} />
		</SideNav>
		<AppSurface>The content of the app.</AppSurface>
	</AppWindow>
	```
-->
<nav
	aria-label={label}
	{...attributes}
	bind:this={ref}
	class={[
		'fs-side-nav',
		{ collapsed, floating, compact, 'no-toggle': !toggleVisible, 'position-right': position === 'right' },
		classes
	]}
	style:--fs-side-nav-width={toLength(width)}
	onkeydown={(e) => invokeHandlers(e, [], [onkeydown, handleKeydown])}
	onfocusout={(e) => invokeHandlers(e, [], [onfocusout, handleFocusout])}
>
	{#if toggleVisible || (header && !collapsed)}
		<div class={['fs-side-nav-header', { 'no-toggle': !toggleVisible }]}>
			{#if toggleVisible}
				<Button
					bind:ref={toggleRef}
					type="button"
					appearance="subtle"
					class="fs-side-nav-toggle"
					aria-label={toggleLabel}
					title={toggleLabel}
					aria-controls={BODY_ID}
					aria-expanded={!collapsed}
					onclick={(event) => setCollapsed(event, !collapsed)}
				>
					<NavigationRegular aria-hidden="true" />
				</Button>
			{/if}
			{#if header && !collapsed}
				<span class="fs-side-nav-heading">{header}</span>
			{/if}
		</div>
	{/if}
	<div id={BODY_ID} class="fs-side-nav-body" hidden={floating && collapsed}>
		{@render region(topContent)}

		<div class="fs-side-nav-items">
			<SideNavList>
				{@render children?.()}
			</SideNavList>
		</div>

		{#if footerContent || footer}
			<div class="fs-side-nav-footer">
				{@render region(footerContent)}

				{#if footer}
					<SideNavList>
						{@render footer()}
					</SideNavList>
				{/if}
			</div>
		{/if}
	</div>
</nav>

<style>
	.fs-side-nav {
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
		flex: none;
		inline-size: var(--fs-side-nav-width);
		max-inline-size: 100%;
		min-block-size: 0;
		color: var(--fs-text-primary);
		font-family: var(--fs-font-family-base);
		font-size: var(--fs-body-font-size);
		/* The line of its items and toggle, which the buttons of a TitleBar share. */
		line-height: 1.4;
		padding-top: 0.25rem;
		/* Without its own toggle the list sits right under the title bar, which already has its button. */
		&.no-toggle:not(.floating) {
			padding-top: 0;
		}
		&.collapsed {
			/* The rail is one item wide: its icon (1rem) and the padding of the item (0.5rem) and of the list (0.25rem). */
			inline-size: 2.5rem;
			& .fs-side-nav-content {
				padding-bottom: 0;
			}
		}
		&.floating {
			position: absolute;
			inset-block: 0;
			inset-inline-start: 0;
			z-index: 3;
			&.position-right {
				inset-inline: auto 0;
			}
			&:not(.collapsed) {
				background: var(--fs-acrylic-background-default);
				border: 1px solid var(--fs-control-surface-stroke-flyout);
				border-radius: var(--fs-control-overlay-border-radius);
				box-shadow: var(--fs-shadow-flyout);
			}
			&.collapsed {
				/* Only the toggle is left, and the content below it stays reachable. */
				pointer-events: none;
			}
		}
		/* The icons keep their place in the rail and out of it, aligned with the toggle. */
		& :global(.fs-list-view-item),
		& :global(.fs-list-view-item-branch-trigger) {
			padding-inline: 0.5rem;
			margin: 0.2rem 0;
		}
		&.compact {
			& :global(.fs-list-view-item-branch-region),
			& :global(.branch-chevron) {
				display: none;
			}
			/* The label still names the branch for assistive technology. */
			& :global(.fs-list-view-branch-label) {
				position: absolute;
				inline-size: 1px;
				block-size: 1px;
				clip-path: inset(50%);
				overflow: hidden;
			}
			& .fs-side-nav-content {
				padding-inline: 0.25rem;
			}
		}
	}
	.fs-side-nav-header {
		display: flex;
		align-items: center;
		flex: none;
		gap: 0.5rem;
		padding-inline: 0.25rem;
		box-sizing: border-box;
		&.no-toggle {
			padding-inline: 0.75rem;
		}
		/* The toggle is the size of an item: the same padding around an icon, and the same line of text under it. */
		& :global(.fs-side-nav-toggle) {
			flex: none;
			padding: 0.275rem 0.5rem 0.4rem;
			font-size: var(--fs-body2-font-size);
			line-height: inherit;
			min-block-size: calc(1lh + 0.675rem);
			pointer-events: auto;
			& :global(svg) {
				inline-size: 1rem;
				block-size: 1rem;
			}
		}
	}
	.fs-side-nav-heading {
		min-inline-size: 0;
		font-weight: 600;
	}
	.fs-side-nav-body {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-block-size: 0;
		&[hidden] {
			display: none;
		}
	}
	.fs-side-nav-content {
		padding: 0.125rem 0.25rem 0.125rem 0.75rem;
	}
	.fs-side-nav-items {
		flex: 1;
		min-block-size: 0;
		overflow: auto;
		padding-inline: 0.25rem;
	}
	.fs-side-nav-footer {
		flex: none;
		padding: 0.125rem 0.25rem;
	}
</style>
