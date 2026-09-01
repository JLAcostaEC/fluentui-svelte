<script lang="ts">
	import { onMount } from 'svelte';
	import { computePosition, offset, autoPlacement, hide, autoUpdate, type Placement } from '@floating-ui/dom';
	import { roundByDPR } from '$internal';
	import type { FlyoutProps } from './types.ts';

	let {
		ref = $bindable(),
		children,
		floating = false,
		reference,
		placement = 'bottom',
		onPlacementChange,
		placementConfig,
		roundCorners = 'all',
		offset: offsetValue = 8,
		class: classes,
		...attributes
	}: FlyoutProps = $props();

	let roundClass = $derived(`round-${roundCorners}`);
	let currentPlacement = $derived(placement);

	function handlePlacementChange(newPlacement: Placement) {
		if (newPlacement !== currentPlacement) {
			currentPlacement = newPlacement;
			onPlacementChange?.(newPlacement);
		}
	}

	function getRoundClass(newPlacement: string) {
		if (roundCorners === newPlacement) return `round-${roundCorners}`;
		if (roundCorners === 'top') return 'round-bottom';
		if (roundCorners === 'bottom') return 'round-top';
		if (roundCorners === 'left') return 'round-right';
		if (roundCorners === 'right') return 'round-left';
		return 'round-all';
	}

	onMount(() => {
		if (floating && reference && ref) {
			const middleware = [offset(offsetValue), autoPlacement(placementConfig), hide()];
			const update = async () => {
				if (!reference || !ref) return;

				const {
					x,
					y,
					middlewareData,
					placement: _placement
				} = await computePosition(reference, ref, {
					placement,
					middleware
				});

				Object.assign(ref.style, {
					transform: `translate(${roundByDPR(x)}px, ${roundByDPR(y)}px)`,
					visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible'
				});

				if (_placement !== currentPlacement) {
					handlePlacementChange(_placement);
					roundClass = getRoundClass(_placement);
				}
			};
			const cleanup = autoUpdate(reference, ref, update);
			return () => cleanup();
		}
	});
</script>

<!--
@component
A contextual popup that displays a set of actions or options. It appears when users interact with a control or action and is dismissed when users click outside of it or select an option.

- Usage:
  ```tsx
  <script>
    import { Flyout } from 'fluentui-svelte';
  </script>

  <Flyout>
    <p>Content goes here</p>
    <Button>Close Flyout</Button>
  </Flyout>
    ```
-->
<div class={['fs-flyout', roundClass, classes, { floating }]} bind:this={ref} {...attributes}>
	{@render children?.()}
</div>

<style>
	.fs-flyout {
		display: flex;
		position: relative;
		padding: 1rem;
		background: var(--fs-acrylic-background-default);
		box-shadow: var(--fs-shadow-flyout);
		border-radius: var(--fs-control-overlay-border-radius);
		border: 1px solid var(--fs-control-surface-stroke-flyout);
		background-clip: padding-box;
		color: var(--fs-text-primary);
		&.floating {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 2;
		}
		&::before {
			content: '';
			border-radius: calc(var(--fs-control-overlay-border-radius) - 0.063rem);
			width: 100%;
			height: 100%;
			position: absolute;
			inset: 0;
			background: var(--fs-acrilic-noise);
			background-size: 2.5rem;
			opacity: 0.1;
			filter: grayscale(1);
			z-index: 0;
			pointer-events: none;
		}
		& :global(> *) {
			z-index: 1;
		}
		&.round-all {
			border-radius: var(--fs-control-overlay-border-radius);
		}
		&.round-top,
		&.round-top::before {
			border-radius: var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius) 0 0;
		}
		&.round-bottom,
		&.round-bottom::before {
			border-radius: 0 0 var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius);
		}
		&.round-left,
		&.round-left::before {
			border-radius: var(--fs-control-overlay-border-radius) 0 0 var(--fs-control-overlay-border-radius);
		}
		&.round-right,
		&.round-right::before {
			border-radius: 0 var(--fs-control-overlay-border-radius) var(--fs-control-overlay-border-radius) 0;
		}
	}
	:global(.dark-mode) .fs-flyout::before {
		opacity: 0.05;
	}
</style>
