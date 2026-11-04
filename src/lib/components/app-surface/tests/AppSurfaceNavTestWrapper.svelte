<script lang="ts">
	import { AppWindow, AppSurface, SideNav, SideNavItem } from '#lib/index.js';
	import type { AppSurfaceProps, SideNavProps } from '#lib/index.js';

	let {
		withNav = true,
		navProps = {},
		surfaceProps = {}
	}: {
		withNav?: boolean;
		navProps?: Omit<SideNavProps, 'children'>;
		surfaceProps?: AppSurfaceProps;
	} = $props();
</script>

<AppWindow width={400} height={240}>
	{#if withNav}
		<SideNav {...navProps}><SideNavItem href="#home" label="Home" /></SideNav>
	{/if}
	<AppSurface data-testid="surface" {...surfaceProps} />
</AppWindow>
