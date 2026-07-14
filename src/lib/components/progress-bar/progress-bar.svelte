<script lang="ts">
	import type { ProgressBarProps } from './types.ts';

	let {
		status,
		class: classes,
		hideRail,
		min = 0,
		max = 100,
		value = $bindable(),
		element = $bindable(),
		railElement = $bindable(),
		trackElement = $bindable(),
		secondaryTrackElement = $bindable(),
		...attributes
	}: ProgressBarProps = $props();

	let checkValue = $derived(typeof value === 'number' ? Math.max(min, Math.min(max, value)) : undefined);
</script>

<!-- @component
  A progress bar component that displays a horizontal progress indicator.
  - Usage:
    ```tsx
    <script>
      import { ProgressBar } from 'fluentui-svelte';
    </script>

    <ProgressBar value={50} />
    ```
-->
<svg
	class="fs-progress-bar status-{status} {classes}"
	role="progressbar"
	width="100%"
	height="3"
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={checkValue}
	class:indeterminate={typeof value !== 'number'}
	bind:this={element}
	{...attributes}
>
	{#if !hideRail}
		<rect bind:this={railElement} height="1" rx="0.5" y="1" width="100%" class="progress-bar-rail" />
	{/if}
	{#if typeof value !== 'number'}
		<rect bind:this={secondaryTrackElement} height="3" ry="3" class="progress-bar-track" />
	{/if}
	<rect
		bind:this={trackElement}
		width={typeof value === 'number' ? `${checkValue}%` : undefined}
		height="3"
		rx="1.5"
		class="progress-bar-track"
	/>
</svg>

<style>
	.fs-progress-bar {
		display: flex;
		align-items: center;
		width: 100%;
		height: 3px;
		& .progress-bar-track {
			height: 3px;
			transition: width var(--fs-slow-duration) var(--fs-point-to-point);
			fill: var(--fs-accent-fill-default);
		}
		& .progress-bar-rail {
			fill: var(--fs-control-stroke-default);
			width: 100%;
			height: 1px;
		}
		&.indeterminate {
			& .progress-bar-track {
				animation-timing-function: ease-in-out;
				&:nth-last-child(2) {
					width: 30%;
					animation: 2.5s infinite indeterminate-1;
				}
				&:last-child {
					width: 50%;
					animation: 2.5s infinite indeterminate-2;
				}
			}
		}
		&.status-paused {
			.progress-bar-track {
				fill: var(--fs-system-caution);
			}
		}
		&.status-error {
			.progress-bar-track {
				fill: var(--fs-system-critical);
			}
		}
		&.status-error.indeterminate,
		&.status-paused.indeterminate {
			.progress-bar-track {
				animation: none;
				width: 100%;
			}
		}
	}
	@keyframes indeterminate-1 {
		0% {
			opacity: 1;
			transform: translateX(-100%);
		}
		75% {
			opacity: 1;
			transform: translateX(120%);
		}
		76% {
			opacity: 0;
		}
		100% {
			opacity: 0;
			transform: translateX(180%);
		}
	}
	@keyframes indeterminate-2 {
		0% {
			opacity: 0;
			transform: translateX(-100%);
		}
		37.49% {
			opacity: 0;
		}
		37.5% {
			opacity: 1;
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(120%);
			opacity: 1;
		}
	}
</style>
