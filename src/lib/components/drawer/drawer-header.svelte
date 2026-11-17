<script lang="ts">
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { RenderSoC } from '#internal';
	import { Button } from '#lib/index.js';
	import { getDrawerContext } from './drawer-context.svelte.ts';
	import type { DrawerHeaderProps } from './types.ts';

	let {
		ref = $bindable(null),
		title,
		headingLevel = 2,
		action,
		hideCloseButton = false,
		closeLabel = 'Close',
		class: classes,
		...attributes
	}: DrawerHeaderProps = $props();

	const context = getDrawerContext();

	if (!context) throw new Error('Drawer context is not available. Make sure this component is used within a Drawer.');

	// The Drawer points `aria-labelledby` at this id.
	const titleId = $derived(`${context.config.id}-title`);
</script>

<header {...attributes} bind:this={ref} class={['fs-drawer-header', classes]}>
	{#if typeof title === 'string'}
		<svelte:element this={`h${headingLevel}`} class="subtitle" id={titleId}>
			{title}
		</svelte:element>
	{:else}
		<RenderSoC SoC={title} args={{ id: titleId }} />
	{/if}
	{#if action || !hideCloseButton}
		<div class="fs-drawer-header-actions">
			{#if action}
				<RenderSoC SoC={action} />
			{/if}
			{#if !hideCloseButton}
				<Button
					type="button"
					appearance="subtle"
					aria-label={closeLabel}
					onclick={() => context.methods.close('close-button')}
				>
					<DismissRegular />
				</Button>
			{/if}
		</div>
	{/if}
</header>

<style>
	/* 24px around the title, 8px below it; the actions sit at the end of the title row. */
	.fs-drawer-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem 1.5rem 0.5rem;
		& > :first-child {
			flex: 1 1 auto;
			min-width: 0;
			margin: 0;
		}
		& .fs-drawer-header-actions {
			display: flex;
			flex-shrink: 0;
			gap: 0.25rem;
			margin-block: -0.25rem;
			margin-inline-end: -0.5rem;
		}
	}
</style>
