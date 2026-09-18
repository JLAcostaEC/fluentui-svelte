<script lang="ts">
	import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, FluentUISvelte } from '$lib/index.js';
	import { FolderRegular } from 'fluentui-icons-svelte';
	import type { BreadcrumbButtonProps, BreadcrumbProps } from '../types.ts';

	let {
		steps = [{ name: 'Home', href: '/' }, { name: 'Files', href: '/files' }, { name: 'This page' }],
		withIcon = false,
		withSlot = false,
		buttonProps,
		...props
	}: {
		steps?: { name: string; href?: string }[];
		withIcon?: boolean;
		/** Stands in for an overflow menu: a step of the trail that is not a `BreadcrumbButton`. */
		withSlot?: boolean;
		buttonProps?: BreadcrumbButtonProps<'button'>;
	} & BreadcrumbProps = $props();
</script>

<FluentUISvelte>
	<Breadcrumb {...props}>
		{#each steps as step, index (step.name)}
			{#if index > 0}
				<BreadcrumbDivider />
			{/if}
			{#if index === 1 && withSlot}
				<BreadcrumbItem>
					<button type="button">More steps</button>
				</BreadcrumbItem>
				<BreadcrumbDivider />
			{/if}
			<BreadcrumbItem>
				{#if step.href}
					<BreadcrumbButton as="a" href={step.href} icon={withIcon ? FolderRegular : undefined}>
						{step.name}
					</BreadcrumbButton>
				{:else}
					<BreadcrumbButton current icon={withIcon ? FolderRegular : undefined} {...buttonProps}>
						{step.name}
					</BreadcrumbButton>
				{/if}
			</BreadcrumbItem>
		{/each}
	</Breadcrumb>
</FluentUISvelte>
