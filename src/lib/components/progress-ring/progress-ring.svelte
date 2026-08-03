<script lang="ts">
	import type { ProgressRingProps } from './types.ts';

	let {
		status,
		size = 32,
		class: classes,
		hideRail,
		min = 0,
		max = 100,
		role,
		'aria-label': ariaLabel,
		indeterminate,
		value = $bindable(0),
		element = $bindable(),
		railElement = $bindable(),
		trackElement = $bindable(),
		...attributes
	}: ProgressRingProps = $props();

	let circumference = $derived(
		(trackElement && Number((Math.PI * (trackElement.r.baseVal.value * 2)).toFixed(2))) || 43.97
	);

	let checkValue = $derived(typeof value === 'number' ? Math.max(min, Math.min(max, value)) : undefined);

	let _role = $derived(role ?? (!indeterminate ? 'progressbar' : 'status'));
</script>

<!-- @component
  A progress ring component that displays a circular progress indicator.
  - Usage:
    ```tsx
    <script>
      import { ProgressRing } from 'fluentui-svelte';
    </script>

    <ProgressRing value={50} size={32} rail />
    ```
-->
<svg
	bind:this={element}
	tabindex="-1"
	class={['progress-ring', status && `status-${status}`, classes, { indeterminate }]}
	width={size}
	height={size}
	viewBox="0 0 16 16"
	role={_role}
	aria-label={ariaLabel ?? (indeterminate ? (!status ? 'Loading' : `Status: ${status}`) : `Progress: ${checkValue}%`)}
	aria-valuemin={!indeterminate ? min : undefined}
	aria-valuemax={!indeterminate ? max : undefined}
	aria-valuenow={!indeterminate ? checkValue : undefined}
	style="--ring-circumference: {circumference}px;"
	{...attributes}
>
	{#if !hideRail}
		<circle
			bind:this={railElement}
			class="progress-ring-rail"
			cx="50%"
			cy="50%"
			r="7"
			stroke-dasharray={circumference}
			stroke-dashoffset={0 * circumference}
		/>
	{/if}
	<circle
		bind:this={trackElement}
		class="progress-ring-track"
		cx="50%"
		cy="50%"
		r="7"
		stroke-dasharray={circumference}
		stroke-dashoffset={((max - (checkValue || 0)) / (max - min)) * circumference}
	/>
</svg>

<style>
	@keyframes progress-ring-indeterminate {
		0% {
			stroke-dasharray: 0.01px var(--ring-circumference);
			transform: rotate(0);
		}
		50% {
			stroke-dasharray: calc(var(--ring-circumference) / 2) calc(var(--ring-circumference) / 2);
			transform: rotate(450deg);
		}
		100% {
			stroke-dasharray: 0.01px var(--ring-circumference);
			transform: rotate(1080deg);
		}
	}
	@keyframes fs-pulse {
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

	.progress-ring {
		outline: none;
		min-inline-size: 16px;
		min-block-size: 16px;
		z-index: 0;

		& circle {
			transform: rotate(-90deg);
			transform-origin: 50% 50%;
			fill: none;
			stroke: var(--fs-accent-fill-default);
			stroke-width: 1.5;
			stroke-linecap: round;
			stroke-dasharray: var(--ring-circumference);
			&.progress-ring-rail {
				stroke: var(--fs-accent-fill-disabled);
			}
		}
		&.indeterminate circle:not(.progress-ring-rail) {
			animation: progress-ring-indeterminate 2s linear infinite;
		}
		&.status-paused {
			& .progress-ring-track {
				stroke: var(--fs-system-caution);
			}
		}
		&.status-error {
			& .progress-ring-track {
				stroke: var(--fs-system-critical);
			}
		}
		@media (prefers-reduced-motion: reduce) {
			&.indeterminate circle.progress-ring-track {
				animation: fs-pulse 3s infinite linear;
				stroke-dasharray: 0px;
			}
		}
	}
</style>
