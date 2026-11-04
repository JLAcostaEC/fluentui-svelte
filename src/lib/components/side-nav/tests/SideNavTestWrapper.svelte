<script lang="ts">
	import {
		AppWindow,
		AppSurface,
		TitleBar,
		TitleBarLeftControls,
		Button,
		SideNav,
		SideNavItem,
		SideNavBranch,
		Menu,
		MenuTrigger,
		MenuPopover,
		MenuList,
		MenuItem
	} from '#lib/index.js';
	import { AppsRegular, SettingsRegular } from 'fluentui-icons-svelte';
	import type { SideNavProps } from '../types.ts';
	import type { Snippet } from 'svelte';
	import FluentUISvelte from '#lib/providers/fluentui-svelte/fluentui-svelte.svelte';

	let {
		collapsed = $bindable(false),
		selectedItems = $bindable([]),
		itemAs = 'a',
		longList = false,
		withMenu = false,
		customControls = false,
		withTitleBar = false,
		globalNav = false,
		onGlobalNav,
		itemContent,
		...props
	}: SideNavProps & {
		itemAs?: 'a' | 'button';
		longList?: boolean;
		withMenu?: boolean;
		customControls?: boolean;
		withTitleBar?: boolean;
		globalNav?: boolean;
		onGlobalNav?: (event: MouseEvent) => void;
		itemContent?: Snippet;
	} = $props();
</script>

{#snippet menuContent()}
	<Menu>
		<MenuTrigger>
			{#snippet children({ state, menuTriggerProps })}
				<Button bind:ref={state.ref} {...menuTriggerProps as any} appearance="subtle" aria-label="Account menu"
					>Account</Button
				>
			{/snippet}
		</MenuTrigger>
		<MenuPopover><MenuList><MenuItem>Sign out</MenuItem></MenuList></MenuPopover>
	</Menu>
{/snippet}

<FluentUISvelte>
	<AppWindow width={640} height={400}>
		{#if globalNav}
			<TitleBar>
				{#snippet leftControls()}<TitleBarLeftControls back globalNav {onGlobalNav} />{/snippet}
			</TitleBar>
		{:else if withTitleBar}<TitleBar />{/if}
		<SideNav
			header="FluentUI App"
			{...props}
			topContent={withMenu ? menuContent : props.topContent}
			bind:collapsed
			bind:selectedItems
		>
			<SideNavItem
				as={itemAs}
				href={itemAs === 'a' ? '#home' : undefined}
				label="Home"
				value="home"
				icon={AppsRegular}
				active={selectedItems.includes('home')}
				children={itemContent}
			/>
			<SideNavItem
				as={itemAs}
				href={itemAs === 'a' ? '#disabled' : undefined}
				label="Disabled"
				disabled
				icon={AppsRegular}
			/>
			<SideNavBranch label="Projects" icon={AppsRegular}>
				<SideNavItem href="#project" label="Project one" icon={AppsRegular} />
			</SideNavBranch>
			{#if customControls}
				<SideNavItem as="div" label="Actions"><Button>Custom action</Button></SideNavItem>
			{/if}
			{#if longList}
				{#each Array.from({ length: 30 }, (_, i) => i) as i (i)}
					<SideNavItem href="#item-{i}" label="Item {i}" icon={AppsRegular} />
				{/each}
			{/if}
			{#snippet footer()}
				<SideNavItem href="#settings" label="Settings" icon={SettingsRegular} />
			{/snippet}
		</SideNav>
		<AppSurface style="display: flex; justify-content: flex-end; align-items: flex-start; min-width: 0"
			><Button>Outside navigation</Button></AppSurface
		>
	</AppWindow>
	<output aria-label="Selected navigation">{selectedItems.join(',')}</output>
</FluentUISvelte>
