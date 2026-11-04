<script lang="ts">
	import { getTabspotAttributes } from 'tabspot';
	import MoreHorizontalRegular from 'fluentui-icons-svelte/MoreHorizontalRegular.svelte';
	import { Button, Menu, MenuList, MenuPopover, MenuTrigger } from '#lib/index.js';
	import { getGlobalFSContext } from '#lib/providers/fluentui-svelte/fluentui-svelte.js';
	import { getMenuContext, setMenuCommandBarContext, COMPONENT_NAME as MENU_COMPONENT_NAME } from './menu.svelte.ts';
	import type { MenuCommandBarProps } from './types.ts';

	let {
		ref = $bindable(null),
		position = 'top',
		label = 'Commands',
		overflowLabel = 'More options',
		overflow,
		showLabels = false,
		showDividers = false,
		children: commands,
		class: classes,
		onkeydown: userOnkeydown,
		...attributes
	}: MenuCommandBarProps = $props();

	if (!getMenuContext()) throw new Error(`No MenuContext found for ${MENU_COMPONENT_NAME}.`);

	const globalFSContext = getGlobalFSContext();

	setMenuCommandBarContext({
		get showLabels() {
			return showLabels;
		}
	});

	// Left and Right move along the bar. Up and Down are left to the bar, which hands the focus over
	// to the items of the menu, and the menu hands it back when its items run out towards the bar.
	const tabspotAttributes = getTabspotAttributes({
		mover: { axis: 'horizontal', ignoreKeys: ['ArrowUp', 'ArrowDown'] },
		grouper: {}
	});

	const isFocusable = (element: HTMLElement) =>
		!element.matches(':disabled, [aria-disabled="true"]') && element.checkVisibility();

	/** The items of the menu the bar sits in, without the bar and without any submenu. */
	const getMenuItems = (list: HTMLElement) =>
		Array.from(list.querySelectorAll<HTMLElement>('[role^="menuitem"]')).filter(
			(item) => item.closest('.fs-menu-list') === list && !ref?.contains(item) && isFocusable(item)
		);

	const focusBar = () =>
		Array.from(ref?.children ?? [])
			.find((child): child is HTMLElement => child instanceof HTMLElement && isFocusable(child))
			?.focus();

	const onkeydown = (e: KeyboardEvent) => {
		// The overflow submenu owns its own keys.
		if (e.target instanceof HTMLElement && e.target.parentElement !== ref) return;

		const list = ref?.closest<HTMLElement>('.fs-menu-list');
		const toItems = position === 'top' ? e.key === 'ArrowDown' : e.key === 'ArrowUp';
		if (!list || !toItems) return;

		const items = getMenuItems(list);
		const item = position === 'top' ? items.at(0) : items.at(-1);
		if (!item) return;

		e.preventDefault();
		item.focus();
	};

	$effect(() => {
		const list = ref?.closest<HTMLElement>('.fs-menu-list');
		const instance = globalFSContext?.state.tabspotInstance;
		if (!list || !instance) return;

		return instance.subscribe(list, (event) => {
			const towardsBar = position === 'top' ? event.direction === 'up' : event.direction === 'down';
			if (!event.atEdge || !towardsBar || ref?.contains(event.from)) return;

			event.preventDefault();
			focusBar();
		});
	});
</script>

<!--
@component

A row of square, icon-only `MenuCommandBarItem`s, the primary commands of a command bar flyout. It goes at the top or at the bottom of a `MenuList`, and sets itself apart from the items with a divider. An `overflow` snippet adds a "more" button that opens the secondary commands in a submenu.

- Usage:
  ```tsx
    <MenuList>
      <MenuCommandBar>
        <MenuCommandBarItem icon={CutRegular} label="Cut" />
        <MenuCommandBarItem icon={CopyRegular} label="Copy" />
        {#snippet overflow()}
          <MenuItem>Select all</MenuItem>
        {/snippet}
      </MenuCommandBar>
      <MenuItem>Paste</MenuItem>
    </MenuList>
  ```
-->
<div
	{...attributes}
	{...tabspotAttributes}
	bind:this={ref}
	role="group"
	aria-label={label}
	class={['fs-menu-command-bar', position, { labels: showLabels, dividers: showDividers }, classes]}
	onkeydown={(e) => {
		userOnkeydown?.(e);
		onkeydown(e);
	}}
>
	{@render commands?.()}
	{#if overflow}
		<Menu>
			<MenuTrigger>
				{#snippet children({ state, menuTriggerProps })}
					<Button
						bind:ref={() => state.ref as HTMLButtonElement | null, (v) => (state.ref = v)}
						{...menuTriggerProps}
						class="{menuTriggerProps.class} fs-menu-command-bar-item"
						appearance="subtle"
						isMenuButton={false}
						indicatorIcon={undefined}
						aria-label={overflowLabel}
						title={overflowLabel}
					>
						<MoreHorizontalRegular aria-hidden="true" />
					</Button>
				{/snippet}
			</MenuTrigger>
			<MenuPopover>
				<MenuList>{@render overflow()}</MenuList>
			</MenuPopover>
		</Menu>
	{/if}
</div>

<style>
	.fs-menu-command-bar {
		display: flex;
		align-items: center;
		/* The squares spread over the width of the menu, the overflow button closing the row. */
		justify-content: space-between;
		/* The commands never squeeze into the width of the menu: the menu grows to fit them all,
		   with this much room between any two. */
		--fs-menu-command-bar-gap: 0.5rem;
		gap: var(--fs-menu-command-bar-gap);
		flex: none;
		padding: 0.25rem;
		/* The divider runs from edge to edge of the menu, like a MenuDivider. */
		margin-inline: -0.25rem;
		&.top {
			border-bottom: 1px solid var(--fs-control-stroke-default);
			margin-block: -0.25rem 0.25rem;
		}
		&.bottom {
			border-top: 1px solid var(--fs-control-stroke-default);
			margin-block: 0.25rem -0.25rem;
		}
		/* Every command is a square of at least 40px, the overflow button included. */
		& > :global(.fs-button.fs-menu-command-bar-item) {
			flex: none;
			/* The overflow button is a submenu trigger, which otherwise spans the whole menu. */
			inline-size: 2.5rem;
			min-inline-size: 2.5rem;
			min-block-size: 2.5rem;
			aspect-ratio: 1;
			padding: 0;
			justify-content: center;
			border-radius: var(--fs-control-inner-border-radius);
		}
		& > :global(.fs-menu-command-bar-item svg) {
			flex: none;
			inline-size: 1.25rem;
			block-size: 1.25rem;
			fill: currentColor;
		}
		/* With labels, or with dividers, the commands share the width of the bar evenly, so a divider
		   always falls halfway between two of them. The icon-only overflow button stays a square. */
		&.labels,
		&.dividers {
			align-items: stretch;
			& > :global(.fs-button.fs-menu-command-bar-item:not(.fs-submenu-trigger)) {
				flex: 1 0 0;
				inline-size: auto;
				min-inline-size: max-content;
				aspect-ratio: auto;
			}
			& > :global(.fs-button.fs-submenu-trigger) {
				aspect-ratio: auto;
			}
		}
		&.labels > :global(.fs-button.fs-menu-command-bar-item:not(.fs-submenu-trigger)) {
			flex-direction: column;
			gap: 0.25rem;
			padding: 0.375rem 0.75rem;
			font-size: var(--fs-caption-font-size);
			line-height: var(--fs-caption-line-height);
		}
		&.dividers > :global(.fs-button.fs-menu-command-bar-item + .fs-button.fs-menu-command-bar-item::before) {
			content: '';
			position: absolute;
			/* Centered in the gap between the two commands. */
			inset-inline-start: calc(var(--fs-menu-command-bar-gap) / -2 - 0.5px);
			inset-block: 25%;
			inline-size: 1px;
			background: var(--fs-divider-stroke-default);
			pointer-events: none;
		}
	}
	:global(.fs-menu-command-bar-item-label) {
		white-space: nowrap;
	}
</style>
