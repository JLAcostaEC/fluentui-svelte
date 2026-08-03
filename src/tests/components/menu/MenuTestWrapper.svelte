<script lang="ts">
	import {
		Menu,
		MenuTrigger,
		MenuPopover,
		MenuList,
		MenuItem,
		MenuItemCheckbox,
		MenuItemRadio,
		MenuGroup,
		MenuDivider,
		Button
	} from '$lib/index.js';

	let {
		open,
		hasIcons,
		hasCheckmarks,
		checkedValues = {},
		onOpenChange,
		onCheckedValueChange,
		variant = 'items'
	}: {
		open?: boolean;
		hasIcons?: boolean;
		hasCheckmarks?: boolean;
		checkedValues?: Record<string, string[]>;
		onOpenChange?: (e: Event, open: boolean) => void;
		onCheckedValueChange?: (e: Event, values: Record<string, string[]>) => void;
		variant?: 'items' | 'checkbox' | 'radio' | 'group';
	} = $props();
</script>

<Menu {open} {hasIcons} {hasCheckmarks} {checkedValues} {onOpenChange} {onCheckedValueChange}>
	<MenuTrigger>
		{#snippet children({ state, menuTriggerProps })}
			<Button bind:ref={state.ref} {...menuTriggerProps as any}>Open Menu</Button>
		{/snippet}
	</MenuTrigger>
	<MenuPopover>
		<MenuList>
			{#if variant === 'items'}
				<MenuItem>New</MenuItem>
				<MenuItem disabled>Disabled Item</MenuItem>
				<MenuDivider />
				<MenuItem>Open</MenuItem>
			{:else if variant === 'checkbox'}
				<MenuItemCheckbox name="opts" value="a">Option A</MenuItemCheckbox>
			{:else if variant === 'radio'}
				<MenuItemRadio name="pick" value="x">Pick X</MenuItemRadio>
				<MenuItemRadio name="pick" value="y">Pick Y</MenuItemRadio>
			{:else if variant === 'group'}
				<MenuGroup header="Section">
					<MenuItem>Grouped</MenuItem>
				</MenuGroup>
			{/if}
		</MenuList>
	</MenuPopover>
</Menu>
