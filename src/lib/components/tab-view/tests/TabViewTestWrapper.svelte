<script lang="ts">
	import { FluentUISvelte, TabView, TabViewTab } from '$lib/index.js';
	import { DocumentRegular } from 'fluentui-icons-svelte';
	import type { TabViewProps, TabViewTabProps } from '../types.ts';

	let {
		tabs = [
			{ value: 'document', label: 'Document' },
			{ value: 'mail', label: 'Mail' },
			{ value: 'calendar', label: 'Calendar' }
		],
		activeTab = $bindable('document'),
		withIcon = false,
		...props
	}: {
		tabs?: { value: string; label: string; props?: TabViewTabProps }[];
		withIcon?: boolean;
	} & TabViewProps = $props();
</script>

<!-- The provider is what starts the tabspot engine, so the strip only rovers inside it. -->
<FluentUISvelte>
	<TabView bind:activeTab listProps={{ 'aria-label': 'Workspaces' }} {...props}>
		{#each tabs as tab (tab.value)}
			<TabViewTab value={tab.value} icon={withIcon ? DocumentRegular : undefined} {...tab.props}>
				{tab.label}
			</TabViewTab>
		{/each}
	</TabView>
</FluentUISvelte>
