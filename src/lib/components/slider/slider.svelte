<script module>
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { watch } from 'runed';
	import { Tooltip } from '$lib/index.js';
	import { preventDefault } from '$internal';
	import type { Attachment } from 'svelte/attachments';
	import type { MouseOrTouchEvent, SliderProps } from './types.ts';

	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		ticks = [],
		tickPlacement = 'around',
		prefix = '',
		suffix = '',
		track = true,
		orientation = 'horizontal',
		reverse = false,
		sync,
		disabled = false,
		tooltip = true,
		tooltipPlacement = 'top',
		tooltipContent,
		onChange,
		class: classes,
		ref = $bindable(),
		inputRef = $bindable(),
		thumbRef = $bindable(),
		tooltipRef = $bindable(),
		railRef = $bindable(),
		trackRef = $bindable(),
		tickBarRef = $bindable(),
		...attributes
	}: SliderProps = $props();

	watch(
		() => step,
		() => {
			if (step > max - min) {
				throw new Error('Step must be less than or equal to the difference between max and min');
			} else if (min >= max) {
				throw new Error('Min must be less than max');
			}
		}
	);

	watch(
		() => value,
		() => {
			const clamped = Math.min(Math.max(value, min), max);
			if (clamped !== value) {
				value = clamped;
				onChange?.(value);
			}
		}
	);

	let dragging = $state(false);
	let holding = $state(false);
	let thumbClientWidth = $state(20);
	let percentage = $derived(valueToPercentage(value));
	let directionAwareReverse = $derived(
		ref && window
			? window.getComputedStyle(ref)?.direction === 'ltr' && orientation === 'horizontal'
				? reverse
				: !reverse
			: reverse
	);

	function valueToPercentage(v: number) {
		return ((v - min) / (max - min)) * 100;
	}

	function cancelMove() {
		holding = false;
		dragging = false;
	}

	function handleMove(event: MouseOrTouchEvent) {
		if (holding) {
			dragging = true;
			calculateValue(event);
		}
	}

	function calculateValue(event: MouseOrTouchEvent) {
		if (disabled || !railRef) return;
		const { top, bottom, left, right, width, height } = railRef.getBoundingClientRect();
		const percentageX = (event as TouchEvent).touches
			? (event as TouchEvent).touches[0].clientX
			: (event as MouseEvent).clientX;
		const percentageY = (event as TouchEvent).touches
			? (event as TouchEvent).touches[0].clientY
			: (event as MouseEvent).clientY;

		const position = orientation === 'horizontal' ? percentageX : percentageY;
		const startingPos =
			orientation === 'horizontal' ? (directionAwareReverse ? right : left) : directionAwareReverse ? top : bottom;
		const length = orientation === 'horizontal' ? width : height;

		let nextStep =
			min +
			Math.round(
				((max - min) *
					((position - startingPos) / length) *
					(directionAwareReverse ? -1 : 1) *
					(orientation === 'vertical' ? -1 : 1)) /
					step
			) *
				step;

		value = nextStep;
	}

	function handleArrowKeys(event: KeyboardEvent) {
		const { key } = event;

		if (key === 'ArrowDown' || key === 'ArrowUp') event.preventDefault();
		if (key === 'ArrowLeft' || (key === 'ArrowDown' && !disabled)) {
			if (reverse) {
				stepUp();
			} else {
				stepDown();
			}
		} else if (key === 'ArrowRight' || (key === 'ArrowUp' && !disabled)) {
			if (reverse) {
				stepDown();
			} else {
				stepUp();
			}
		}
	}

	function handleTouchStart(event: TouchEvent) {
		if (event.cancelable) event.preventDefault();
		holding = true;
	}

	function linearScale(input: readonly [number, number], output: readonly [number, number]) {
		return (value: number) => {
			if (input[0] === input[1] || output[0] === output[1]) return output[0];
			const ratio = (output[1] - output[0]) / (input[1] - input[0]);
			return output[0] + ratio * (value - input[0]);
		};
	}

	function stepUp() {
		value += step;
		if (value > max) {
			value = max;
		}
	}

	function stepDown() {
		value -= step;
		if (value < min) {
			value = min;
		}
	}

	$effect.pre(() => {
		if (!sync) return;

		untrack(() => {
			// set the nearest step value on initialization (if the provided value is not exactly on a step)
			const nearestStepValue = Math.round((value - min) / step) * step + min;
			if (nearestStepValue !== value) {
				value = nearestStepValue;
			}
		});
	});
</script>

<!-- 
	@component
	A slider allows users to select a value from a continuous or discrete range by moving a thumb along a track. It supports horizontal and vertical orientations, ticks, tooltips, and reverse direction.

	- Usage:
	```tsx
	<script>
		import { Slider } from 'fluentui-svelte';
	</script>

	<Slider value={50} min={0} max={100} />
	<Slider orientation="vertical" step={10} ticks={[0, 25, 50, 75, 100]} />
	```

	@status WIP
-->
<svelte:window
	onmousemove={handleMove}
	ontouchmove={handleMove}
	onmouseup={cancelMove}
	ontouchend={cancelMove}
	ontouchcancel={cancelMove}
/>

<div
	class="fs-slider orientation-{orientation} {classes}"
	class:disabled
	class:reverse={directionAwareReverse}
	bind:this={ref}
	tabindex={disabled ? -1 : 0}
	role="slider"
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={value}
	ontouchstart={handleTouchStart}
	onkeydown={handleArrowKeys}
	onmousedown={preventDefault(() => {
		holding = true;
		dragging = true;
	})}
	style="--slider-percentage: {percentage}%; --slider-thumb-offset: {thumbClientWidth / 2 -
		linearScale([0, 50], [6, thumbClientWidth / 2])(percentage)}px;"
	{...attributes}
>
	{#if tooltip && !disabled}]
		<Tooltip
			content={tooltipContent ?? `${prefix}${value}${suffix}`}
			placement={tooltipPlacement}
			relationship="description"
			bind:preventClose={dragging}
			bind:ref={tooltipRef}
			withArrow
			class="slider-tooltip"
			animationFrame
		>
			{#snippet children(args, ref)}
				{@render sliderThumb(args, ref)}
			{/snippet}
		</Tooltip>
	{:else}
		{@render sliderThumb()}
	{/if}

	<div class="slider-rail" bind:this={railRef}>
		{#if track}
			<div class="slider-track" bind:this={trackRef}></div>
		{/if}
	</div>

	{#if ticks}
		<div class="slider-tick-bar placement-{tickPlacement}" bind:this={tickBarRef}>
			{#each ticks as tick (tick)}
				<div class="slider-tick" style="--slider-tick-percentage: {valueToPercentage(tick)}%"></div>
			{/each}
		</div>
	{/if}
	<input type="range" hidden {min} {max} {step} {disabled} {value} bind:this={inputRef} />
</div>

{#snippet sliderThumb(attrs: Record<string, unknown> | undefined = undefined, ref: Attachment | undefined = undefined)}
	<div
		class="slider-thumb"
		{...attrs}
		{@attach ref ? ref : undefined}
		bind:this={thumbRef}
		bind:clientWidth={thumbClientWidth}
	></div>
{/snippet}

<style>
	.fs-slider {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		border-radius: var(--fs-control-border-radius);
		min-inline-size: 32px;
		min-block-size: 32px;

		& :focus-visible {
			outline: none;
			box-shadow: var(--fs-focus-stroke-outer);
		}

		&.orientation-horizontal {
			block-size: 32px;
			inline-size: 100%;

			& .slider-rail {
				inline-size: 100%;
				block-size: 4px;
			}

			& .slider-track {
				inline-size: var(--slider-percentage);
				block-size: 100%;
			}

			& .slider-thumb {
				inset-inline-start: calc(var(--slider-percentage) + var(--slider-thumb-offset));
				transform: translateX(-50%);
			}

			& .slider-tick {
				flex-direction: column;
				height: 100%;
				padding: 2px 0;
				inset-inline-start: var(--slider-tick-percentage);

				&::before,
				&::after {
					width: 1px;
					height: 6px;
					border-inline-start: 1px solid var(--fs-control-strong-stroke-default);
				}
			}

			&.reverse {
				& .slider-rail {
					justify-content: flex-end;
				}

				& .slider-thumb {
					inset-inline-start: unset;
					inset-inline-end: calc(var(--slider-percentage) + var(--slider-thumb-offset));
					transform: translateX(50%);
				}

				& .slider-tick {
					inset-inline-start: unset;
					inset-inline-end: var(--slider-tick-percentage);
				}
			}
		}

		&.orientation-vertical {
			block-size: 100%;
			inline-size: 32px;

			& .slider-rail {
				align-items: flex-end;
				block-size: 100%;
				inline-size: 4px;
			}

			& .slider-track {
				inline-size: 100%;
				block-size: var(--slider-percentage);
			}

			& .slider-thumb {
				inset-block-end: calc(var(--slider-percentage) + var(--slider-thumb-offset));
				transform: translateY(50%);
			}

			& .slider-tick {
				width: 100%;
				padding: 0 6px;
				inset-block-end: var(--slider-tick-percentage);

				&::before,
				&::after {
					width: 4px;
					height: 1px;
					border-block-start: 1px solid var(--fs-control-strong-default);
				}
			}

			&.reverse {
				& .slider-rail {
					align-items: flex-start;
				}

				& .slider-thumb {
					inset-block-end: unset;
					inset-block-start: calc(var(--slider-percentage) + var(--slider-thumb-offset));
					transform: translateY(-50%);
				}

				& .slider-tick {
					inset-block-end: unset;
					inset-block-start: var(--slider-tick-percentage);
				}
			}
		}

		&.disabled {
			& .slider-rail {
				background-color: var(--fs-accent-fill-disabled);
			}

			& .slider-track {
				background-color: var(--fs-accent-fill-disabled);
			}

			& .slider-thumb::before {
				background-color: var(--fs-accent-fill-disabled);
				transform: none;
			}

			& .slider-tick::before,
			& .slider-tick::after {
				border-color: var(--fs-control-strong-disabled);
			}
		}
	}

	.slider-rail {
		display: flex;
		align-items: center;
		overflow: hidden;
		border-radius: 50px;
		background-color: var(--fs-control-strong-default);
	}

	.slider-track {
		background-color: var(--fs-accent-fill-default);
	}

	.slider-tick-bar {
		position: absolute;
		z-index: -1;
		width: 100%;
		height: 100%;
		inset-block-start: 0;
		inset-inline-start: 0;

		&.placement-before .slider-tick::after {
			visibility: hidden;
		}

		&.placement-after .slider-tick::before {
			visibility: hidden;
		}
	}

	.slider-tick {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		box-sizing: border-box;

		&::before,
		&::after {
			content: '';
		}
	}

	.slider-thumb {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		z-index: 10;
		border-radius: 100%;
		background-color: var(--fs-control-solid);
		box-shadow: 0 0 0 1px var(--fs-control-stroke-default);
		inline-size: 20px;
		block-size: 20px;

		&::before {
			content: '';
			position: absolute;
			border-radius: 100%;
			background-color: var(--fs-accent-fill-default);
			transition: var(--fs-fast-duration) var(--fs-control-fast-out-slow-in-easing) transform;
			inline-size: 12px;
			block-size: 12px;
		}

		&:hover {
			&::before {
				transform: scale(1.167);
			}
		}

		&:active {
			&::before {
				background-color: var(--fs-accent-fill-tertiary);
				transform: scale(0.833);
			}
		}
	}
</style>
