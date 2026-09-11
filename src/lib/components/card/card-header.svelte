<script lang="ts">
	import type { CardHeaderProps } from './types.ts';
	import { RenderSoC } from '$internal';
	import { getCardContext } from './card-context.svelte.ts';

	let {
		ref = $bindable(),
		class: classes,
		title,
		image,
		description,
		action,
		...attributes
	}: CardHeaderProps = $props();

	const context = getCardContext();

	if (!context) throw new Error('Card context is not available. Make sure this component is used within a Card.');

	const { config } = context;

	const { showFloatingAction, selectable, id } = config;

	$effect.pre(() => {
		if (action && selectable) throw new Error('Action cannot be used with selectable cards.');
	});
</script>

<div bind:this={ref} class={['fs-card-header', showFloatingAction && 'with-action', classes]} {...attributes}>
	{#if typeof image === 'string'}
		<img src={image} alt="alt" />
	{:else if image}
		<RenderSoC SoC={image} />
	{/if}
	{#if description}
		<div class="fs-card-header-content">
			{#if typeof title === 'string'}
				<h4 class="body" id={`${id}-title`}>{title}</h4>
			{:else if title}
				<RenderSoC SoC={title} args={{ id: `${id}-title` }} />
			{/if}
			{#if typeof description === 'string'}
				<p class="caption">{description}</p>
			{:else if description}
				<RenderSoC SoC={description} />
			{/if}
		</div>
	{:else}
		{#if typeof title === 'string'}
			{title}
		{:else if title}
			<RenderSoC SoC={title} args={{ id: `${id}-title` }} />
		{/if}
	{/if}
	{#if action}
		<RenderSoC SoC={action} />
	{/if}
</div>

<style>
	.fs-card-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		&.with-action:nth-child(2) {
			padding-right: 2.4rem;
		}
		& :global(img) {
			width: 48px;
		}
		& .fs-card-header-content {
			display: flex;
			flex-direction: column;
			margin-right: auto;
		}
	}
</style>
