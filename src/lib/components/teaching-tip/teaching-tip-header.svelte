<script lang="ts">
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { RenderSoC } from '#internal';
	import { Button } from '#lib/index.js';
	import { getTeachingTipContext } from './teaching-tip-context.svelte.ts';
	import type { TeachingTipHeaderProps } from './types.ts';

	let {
		ref = $bindable(null),
		title,
		headingLevel = 3,
		icon,
		description,
		step,
		totalSteps,
		formatStep = (step, totalSteps) => `${step} of ${totalSteps}`,
		hideCloseButton = false,
		closeLabel = 'Close',
		class: classes,
		...attributes
	}: TeachingTipHeaderProps = $props();

	const context = getTeachingTipContext();

	if (!context)
		throw new Error('TeachingTip context is not available. Make sure this component is used within a TeachingTip.');

	// The TeachingTip points `aria-labelledby` at this id.
	const titleId = $derived(`${context.config.id}-title`);
</script>

<div {...attributes} bind:this={ref} class={['fs-teaching-tip-header', classes]}>
	{#if icon}
		<span class="fs-teaching-tip-header-icon" aria-hidden="true">
			<RenderSoC SoC={icon} />
		</span>
	{/if}
	<div class="fs-teaching-tip-header-content">
		{#if typeof title === 'string'}
			<svelte:element this={`h${headingLevel}`} class="body strong" id={titleId}>
				{title}
			</svelte:element>
		{:else}
			<RenderSoC SoC={title} args={{ id: titleId }} />
		{/if}
		{#if typeof description === 'string'}
			<p class="body">{description}</p>
		{:else if description}
			<RenderSoC SoC={description} />
		{/if}
	</div>
	{#if step != null && totalSteps != null}
		<span class="fs-teaching-tip-header-step body">
			{formatStep(step, totalSteps)}
		</span>
	{/if}
	{#if !hideCloseButton}
		<Button
			type="button"
			class="fs-teaching-tip-close"
			appearance="subtle"
			aria-label={closeLabel}
			onclick={context.methods.close}
		>
			<DismissRegular />
		</Button>
	{/if}
</div>

<style>
	.fs-teaching-tip-header {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		& .fs-teaching-tip-header-icon {
			display: flex;
			flex-shrink: 0;
			align-self: center;
			width: 1.5rem;
		}
		& .fs-teaching-tip-header-content {
			display: flex;
			flex: 1 1 auto;
			flex-direction: column;
			min-width: 0;
		}
		& .fs-teaching-tip-header-step {
			flex-shrink: 0;
			color: var(--fs-text-secondary);
			font-variant-numeric: tabular-nums;
		}
		& :global(.fs-teaching-tip-close) {
			flex-shrink: 0;
			justify-content: center;
			align-items: center;
			width: 1.625rem;
			min-width: 1.625rem;
			height: 1.625rem;
			margin: -0.375rem -0.375rem 0 0;
			padding: 0.125rem;
		}
	}
</style>
