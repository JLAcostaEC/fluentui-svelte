<script lang="ts">
	import { FluentUISvelte, TopNav, TopNavItem } from '$lib/index.js';
	import { AirplaneRegular } from 'fluentui-icons-svelte';
	import type { TopNavItemGenerics, TopNavItemProps, TopNavProps } from '../types.ts';

	let {
		items = [
			{ value: 'tab1', label: 'First Tab' },
			{ value: 'tab2', label: 'Second Tab' },
			{ value: 'tab3', label: 'Third Tab' }
		],
		selectedValue = $bindable('tab1'),
		withIcon = false,
		...props
	}: {
		items?: { value: string; label: string; props?: TopNavItemProps<TopNavItemGenerics> }[];
		withIcon?: boolean;
	} & TopNavProps = $props();
</script>

<!-- The provider is what starts the tabspot engine, so the strip only rovers inside it. -->
<FluentUISvelte>
	<TopNav bind:selectedValue aria-label="Flights" {...props}>
		{#each items as item (item.value)}
			<TopNavItem value={item.value} icon={withIcon ? AirplaneRegular : undefined} {...item.props}>
				{item.label}
			</TopNavItem>
		{/each}
	</TopNav>
</FluentUISvelte>
