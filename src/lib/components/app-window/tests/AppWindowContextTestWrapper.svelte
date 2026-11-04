<script lang="ts">
	import {
		AppWindow,
		AppSurface,
		SideNav,
		SideNavItem,
		TitleBar,
		TitleBarLeftControls,
		TitleBarRightControls
	} from '#lib/index.js';
	import type { AppWindowProps, AppWindowContext } from '#lib/index.js';
	import Probe from './AppWindowContextProbe.svelte';
	let {
		collapsed = $bindable(false),
		floating = false,
		showNav = true,
		showTitle = true,
		globalNav = false,
		showSurface = true,
		nested = false,
		surfaceActive,
		controlsMaximized,
		onContext,
		...props
	}: Omit<AppWindowProps, 'children'> & {
		collapsed?: boolean;
		floating?: boolean;
		showNav?: boolean;
		showTitle?: boolean;
		globalNav?: boolean;
		showSurface?: boolean;
		nested?: boolean;
		surfaceActive?: boolean;
		controlsMaximized?: boolean;
		onContext?: (context: AppWindowContext | null) => void;
	} = $props();
</script>

<AppWindow width={640} height={400} {...props}>
	{#if showTitle}
		<TitleBar>
			{#snippet leftControls()}{#if globalNav}<TitleBarLeftControls globalNav />{/if}{/snippet}
			{#snippet rightControls()}<TitleBarRightControls maximized={controlsMaximized} />{/snippet}
		</TitleBar>
	{/if}
	{#if showNav}
		<SideNav bind:collapsed {floating}><SideNavItem href="#home" label="Home" /></SideNav>
	{/if}
	{#if showSurface}
		<AppSurface active={surfaceActive} data-testid="outer-surface">
			<Probe {onContext} />
			{#if nested}
				<AppWindow width={200} height={160} active={false} maximized={false}>
					<SideNav><SideNavItem href="#inner" label="Inner" /></SideNav>
					<AppSurface data-testid="inner-surface"><Probe name="Nested state" /></AppSurface>
				</AppWindow>
			{/if}
		</AppSurface>
	{/if}
</AppWindow>
