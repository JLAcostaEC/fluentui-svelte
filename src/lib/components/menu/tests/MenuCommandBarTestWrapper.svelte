<script lang="ts">
	import {
		Button,
		Menu,
		MenuItem,
		MenuCommandBar,
		MenuCommandBarItem,
		MenuList,
		MenuPopover,
		MenuTrigger
	} from '#lib/index.js';
	import { CopyRegular, CutRegular, ClipboardPasteRegular } from 'fluentui-icons-svelte';
	import type { MenuCommandBarProps } from '../types.ts';
	import FluentUISvelte from '#lib/providers/fluentui-svelte/fluentui-svelte.svelte';

	let {
		position = 'top',
		withOverflow = true,
		bar,
		onCommand,
		onOverflowItem,
		onOpenChange
	}: {
		position?: 'top' | 'bottom';
		withOverflow?: boolean;
		bar?: Partial<MenuCommandBarProps>;
		onCommand?: (name: string) => void;
		onOverflowItem?: () => void;
		onOpenChange?: (e: Event, open: boolean) => void;
	} = $props();
</script>

{#snippet overflowItems()}
	<MenuItem onclick={() => onOverflowItem?.()}>Select all</MenuItem>
	<MenuItem>Find</MenuItem>
{/snippet}

{#snippet commands()}
	<MenuCommandBarItem icon={CutRegular} label="Cut" onclick={() => onCommand?.('cut')} />
	<MenuCommandBarItem icon={CopyRegular} label="Copy" onclick={() => onCommand?.('copy')} />
	<MenuCommandBarItem icon={ClipboardPasteRegular} label="Paste" disabled />
{/snippet}

{#snippet list()}
	<MenuList>
		{#if position === 'top'}
			<MenuCommandBar {...bar} {position} overflow={withOverflow ? overflowItems : undefined}>
				{@render commands()}
			</MenuCommandBar>
		{/if}
		<MenuItem>Alpha</MenuItem>
		<MenuItem>Beta</MenuItem>
		{#if position === 'bottom'}
			<MenuCommandBar {...bar} {position} overflow={withOverflow ? overflowItems : undefined}>
				{@render commands()}
			</MenuCommandBar>
		{/if}
	</MenuList>
{/snippet}

<FluentUISvelte>
	<Menu {onOpenChange}>
		<MenuTrigger>
			{#snippet children({ state, menuTriggerProps })}
				<Button bind:ref={state.ref} {...menuTriggerProps as any}>Open menu</Button>
			{/snippet}
		</MenuTrigger>
		<MenuPopover>
			{@render list()}
		</MenuPopover>
	</Menu>
</FluentUISvelte>
