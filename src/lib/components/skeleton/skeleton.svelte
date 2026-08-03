<script lang="ts" generics="Tag extends SkeletonTags = 'div'">
	import type { SkeletonProps, SkeletonTags } from './types.ts';

	let {
		as = 'div' as Tag,
		animation = 'wave',
		shape = 'rounded',
		justify,
		class: classes,
		element = $bindable(),
		...attributes
	}: SkeletonProps<Tag> = $props();
</script>

<!-- 
	@component
	This is a implementation of Fluent UI Skeleton component. The skeleton supports two visual animations (wave & pulse) and three shapes (circle, square & rounded).
  
  - Usage:
    ```tsx
    <script>
      import { Skeleton } from 'fluentui-svelte';
    </script>

    <Skeleton />
    <Skeleton animation="pulse" shape="circle" height="42px" />
    <Skeleton animation="wave" shape="square" height="24px" />
    ```
 -->
<svelte:element
	this={as}
	bind:this={element}
	class={['fs-skeleton', animation, shape, classes, { justify }]}
	{...attributes}
></svelte:element>

<style>
	.fs-skeleton {
		background: var(--fs-system-neutral-bg);
		overflow: hidden;
		position: relative;
		&.justify {
			width: 100%;
		}
		&:not(.justify) {
			aspect-ratio: 1;
		}
		&.circle {
			border-radius: 9999px;
		}
		&.square {
			border-radius: 0;
		}
		&.rounded {
			border-radius: 4px;
		}
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 100;
		}
		&.wave::after {
			background-image: linear-gradient(
				90deg,
				transparent 20%,
				color-mix(in srgb, var(--fs-control-on-image-fill-default), transparent 40%) 50%,
				transparent 80%
			);
			transform: translateX(-100%);
			animation: fs-skeleton-wave 3s infinite var(--fs-point-to-point);
		}
		&.pulse::after {
			background: var(--fs-system-neutral-bg);
			animation: fs-skeleton-pulse 1s infinite var(--fs-point-to-point);
		}
	}

	@keyframes fs-skeleton-wave {
		100% {
			transform: translateX(100%);
		}
	}
	@keyframes fs-skeleton-pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
