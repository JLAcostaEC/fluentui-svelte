<script lang="ts">
	import { ListView, SideNavItem, SideNavBranch } from '#lib/index.js';
	import { AppsRegular } from 'fluentui-icons-svelte';
	import FluentUISvelte from '#lib/providers/fluentui-svelte/fluentui-svelte.svelte';

	let { onAction }: { onAction?: (event: MouseEvent, value: string) => void } = $props();
</script>

<FluentUISvelte>
	<ListView role="list" aria-label="Plain list">
		<SideNavItem href="#home" label="Home" value="home" icon={AppsRegular} {onAction} />
		<SideNavBranch label="Projects" icon={AppsRegular}>
			<SideNavItem href="#project" label="Project one" />
		</SideNavBranch>
	</ListView>
</FluentUISvelte>
