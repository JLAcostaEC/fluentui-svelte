<script lang="ts">
	import { Button } from '$lib/index.js';
	import { Expander, invokeHandlers, RenderSoC } from '$internal';
	import { getReducedMotion } from '$lib/providers/fluentui-svelte/fluentui-svelte.js';
	import ChevronUpFilled from 'fluentui-icons-svelte/ChevronUpFilled.svelte';
	import type { Action } from 'svelte/action';
	import type { ExpanderProps } from './types.ts';

	let {
		header,
		description,
		disabled = false,
		direction = 'down',
		animation,
		justify = false,
		ref = $bindable(),
		expanded = $bindable(false),
		children,
		Icon,
		summaryRef = $bindable(),
		summaryProps,
		...attributes
	}: ExpanderProps = $props();

	const handleClick = () => (expanded = !expanded);

	const reducedMotion = getReducedMotion();

	let supportInterpolation = $state(false);

	const expander: Action<HTMLDetailsElement> = (element) => {
		supportInterpolation = CSS.supports('interpolate-size', 'allow-keywords');
		let cleanEvent: (() => void) | null = null;
		if (!supportInterpolation) {
			const duration = animation?.duration || 400;
			const easing =
				animation?.easing ||
				getComputedStyle(document.documentElement).getPropertyValue('--fs-point-to-point') ||
				'ease-in-out';
			cleanEvent = new Expander(element, direction, duration, easing, reducedMotion).cleanEvent;
		}
		return {
			destroy: () => {
				cleanEvent?.();
			}
		};
	};
</script>

<!-- 
@component

The expander is a collapsible container that can be used to hide or show content. 
It is used to reduce the amount of information displayed on the screen and to 
improve the user experience.

- Usage:
```tsx
<script>
  import { Expander } from 'fluentui-svelte';
</script>

<Expander label="Expander label" description="Expander description">
  <p>Expander content</p>
</Expander>
```
-->
<details
	bind:this={ref}
	bind:open={expanded}
	use:expander
	class={['fs-expander', direction, { disabled, justify }]}
	{...attributes}
>
	<summary
		class="fs-summary"
		onclick={(e) => invokeHandlers(e, [disabled], [supportInterpolation && (() => e.preventDefault()), handleClick])}
		bind:this={summaryRef}
		{...summaryProps}
	>
		<span class="row">
			{#if Icon}
				<span class="icon">
					<RenderSoC SoC={Icon} />
				</span>
			{/if}
			<span class="title-wrapper">
				{header}
				{#if description}
					<small class="description">
						{description}
					</small>
				{/if}
			</span>
		</span>
		<Button as="div" {disabled} appearance="subtle">
			<ChevronUpFilled
				class={`button-icon ${direction === 'down' ? (expanded ? '' : 'flip') : expanded ? 'flip' : ''}`}
			/>
		</Button>
	</summary>
	<div class="content {direction}">
		{@render children?.()}
	</div>
</details>

<style>
	.fs-expander {
		display: flex;
		flex-direction: column;
		flex: 0 1 auto;
		width: max-content;
		&.justify {
			width: 100%;
		}
		&.up {
			flex-direction: column-reverse;
		}
		& .row {
			display: flex;
			align-items: center;
			gap: 0.625rem;
			width: 100%;
		}
		& .fs-summary {
			user-select: none;
			display: flex;
			justify-content: space-between;
			list-style: none;
			background-clip: padding-box;
			border: 0.063rem solid var(--fs-card-stroke-default);
			border-radius: var(--fs-control-border-radius);
			background-color: var(--fs-card-background-default);
			padding: 0.5rem 0.5rem 0.5rem 1rem;
			outline: none;
			cursor: pointer;
			& .title-wrapper {
				line-height: var(--fs-body2-line-height);
				font-size: var(--fs-body2-font-size);
				color: var(--fs-text-primary);
				font-weight: 400;
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				gap: 0rem;
				padding-right: 1rem;
				& .description {
					font-size: var(--fs-caption-font-size);
					color: var(--fs-text-secondary);
					margin: 0;
					width: 100%;
				}
			}
			& .icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 1.2rem;
				max-width: 1.2rem;
				height: 1.2rem;
				color: var(--fs-text-primary);
				& :global(svg) {
					color: var(--fs-text-primary);
				}
			}
			&:hover {
				/* In the official documentation, this should NOT happen, however, in Windows 11 you can see that they do! and the button stops having hover effects at the same time. */
				/* background-color: var(--fs-card-background-secondary); */
				& :global(.fs-button.subtle) {
					background: var(--fs-subtle-fill-secondary);
				}
			}
			&:focus-visible {
				outline: 0.125rem var(--fs-focus-stroke-outer) solid;
				outline-offset: 0.063rem;
			}
			&:active {
				& :global(.fs-button.subtle) {
					background: var(--fs-subtle-fill-tertiary);
				}
			}
			& :global(.button-icon) {
				transition: transform var(--fs-slow-duration) var(--fs-fast-dismiss);
				width: 1.2rem;
				color: var(--fs-text-primary);
			}
			& :global(.flip) {
				transform: rotate(180deg);
			}
		}
		& .content {
			background-clip: padding-box;
			border: 0.063rem solid var(--fs-card-stroke-default);
			background-color: var(--fs-card-background-secondary);
			&.up {
				border-bottom: none;
				border-top-right-radius: var(--fs-control-border-radius);
				border-top-left-radius: var(--fs-control-border-radius);
			}
			&.down {
				border-top: none;
				border-bottom-right-radius: var(--fs-control-border-radius);
				border-bottom-left-radius: var(--fs-control-border-radius);
			}
		}
		&[open] {
			&.up .fs-summary {
				border-top-right-radius: 0;
				border-top-left-radius: 0;
			}
			&.down .fs-summary {
				border-bottom-right-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
		&.disabled {
			& .fs-summary {
				cursor: not-allowed;
			}
			& .title-wrapper {
				color: var(--fs-text-disabled);
			}
			& :global(.button-icon *) {
				color: var(--fs-text-disabled) !important;
				fill: var(--fs-text-disabled) !important;
			}
		}
	}
	@supports (interpolate-size: allow-keywords) {
		:root {
			interpolate-size: allow-keywords;
		}
		::details-content {
			display: contents;
		}
		.content {
			transition:
				height var(--fs-normal-duration) var(--fs-point-to-point),
				content-visibility var(--fs-normal-duration) allow-discrete;
			height: 0;
			overflow: clip;
			visibility: hidden;
		}
		[open] .content {
			visibility: visible;
			height: max-content;
		}
	}
</style>
