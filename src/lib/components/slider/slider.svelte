<script module>
</script>

<script lang="ts">
	import { claimLabel } from '../label/label-context.ts';
	import { untrack } from 'svelte';
	import { watch } from 'runed';
	import { Tooltip } from '#lib/index.js';
	import { dispatchFieldEvents, invokeHandlers } from '#internal';
	import type { Attachment } from 'svelte/attachments';
	import type { MouseOrTouchEvent, SliderProps } from './types.ts';

	const labelContext = claimLabel(() => id);

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
		buffer,
		orientation = 'horizontal',
		reverse = false,
		sync,
		disabled = false,
		tooltip = true,
		tooltipPlacement = 'top',
		tooltipContent,
		tooltipPositionConfig,
		onChange,
		id = labelContext?.fieldId,
		ref = $bindable(null),
		wrapperRef = $bindable(null),
		wrapperAttributes,
		thumbRef = $bindable(null),
		tooltipRef = $bindable(null),
		railRef = $bindable(null),
		trackRef = $bindable(null),
		tickBarRef = $bindable(null),
		defaultValue = min,
		onkeydown,
		...attributes
	}: SliderProps = $props();

	/**
	 * The props the invariants rule over. The markup renders them through here, so reading any of
	 * them validates the whole set during SSR and on every prop update.
	 */
	const _range = $derived.by(() => {
		if (step > max - min) {
			throw new Error('Step must be less than or equal to the difference between max and min');
		} else if (min >= max) {
			throw new Error('Min must be less than max');
		}
		return { min, max, step };
	});

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

	/** A slider that nothing else names falls back to a generic name. */
	const named = $derived(
		!!(attributes['aria-label'] || attributes['aria-labelledby'] || ref?.labels?.length || labelContext)
	);

	/** A `fieldset` disables the slider without its `disabled` prop, and only the native input knows. */
	const inert = () => disabled || !!ref?.matches(':disabled');

	let dragging = $state(false);
	let holding = $state(false);
	/** Whether the pointer moved the value since it was pressed, which the release reports as a `change`. */
	let moved = false;
	let thumbClientWidth = $state(20);
	let percentage = $derived(valueToPercentage(value));
	let bufferPercentage = $derived(
		buffer === undefined ? undefined : Math.min(Math.max(valueToPercentage(buffer), 0), 100)
	);
	let directionAwareReverse = $derived(
		wrapperRef && orientation === 'horizontal' && window.getComputedStyle(wrapperRef).direction === 'rtl'
			? !reverse
			: reverse
	);

	function valueToPercentage(v: number) {
		return ((v - min) / (max - min)) * 100;
	}

	function cancelMove() {
		if (moved) dispatchFieldEvents(ref, ['change']);
		moved = false;
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
		if (inert() || !railRef) return;
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
		// A rail without length (e.g. a vertical slider in a parent with no height) has no scale to read the pointer on.
		if (!length) return;

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

		nextStep = Math.min(Math.max(nextStep, min), max);
		if (nextStep === value) return;

		value = nextStep;
		moved = true;
		dispatchFieldEvents(ref, ['input']);
	}

	/** The arrows follow the direction the slider is drawn in, so they replace the stepping of the native input. */
	function handleArrowKeys(event: KeyboardEvent) {
		const { key } = event;
		const increase = key === 'ArrowRight' || key === 'ArrowUp';

		if (!increase && key !== 'ArrowLeft' && key !== 'ArrowDown') return;

		event.preventDefault();
		const previous = value;

		if (increase !== reverse) {
			stepUp();
		} else {
			stepDown();
		}

		if (value !== previous) dispatchFieldEvents(ref);
	}

	function handleTouchStart(event: TouchEvent) {
		if (event.cancelable) event.preventDefault();
		holding = true;
		calculateValue(event);
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
-->
<svelte:window
	onmousemove={handleMove}
	ontouchmove={handleMove}
	onmouseup={cancelMove}
	ontouchend={cancelMove}
	ontouchcancel={cancelMove}
/>

<!-- The pointer works on the drawing; the keyboard, assistive technologies and forms work on the native input inside the thumb. -->
<div
	{...wrapperAttributes}
	class={[
		'fs-slider',
		`orientation-${orientation}`,
		{ disabled },
		directionAwareReverse && 'reverse',
		wrapperAttributes?.class
	]}
	bind:this={wrapperRef}
	ontouchstart={(e) => invokeHandlers(e, [inert()], [handleTouchStart, wrapperAttributes?.ontouchstart])}
	onmousedown={(e) =>
		invokeHandlers(
			e,
			[inert()],
			[
				() => {
					e.preventDefault();
					ref?.focus();
					holding = true;
					dragging = true;
					// A press moves the thumb to the pointer, so a single click on the rail sets the value.
					calculateValue(e);
				},
				wrapperAttributes?.onmousedown
			]
		)}
	style="--slider-percentage: {percentage}%; --slider-thumb-offset: {thumbClientWidth / 2 -
		linearScale([0, 50], [6, thumbClientWidth / 2])(percentage)}px; {wrapperAttributes?.style ?? ''}"
>
	{#if tooltip && !disabled}
		<Tooltip
			content={tooltipContent ?? `${prefix}${value}${suffix}`}
			placement={tooltipPlacement}
			positionConfig={tooltipPositionConfig}
			relationship="description"
			bind:preventClose={dragging}
			bind:ref={tooltipRef}
			withArrow
			class="slider-tooltip"
			animationFrame
		>
			{#snippet children(args, attach)}
				{@render sliderThumb(args, attach)}
			{/snippet}
		</Tooltip>
	{:else}
		{@render sliderThumb()}
	{/if}

	<div class="slider-rail" bind:this={railRef}>
		{#if bufferPercentage !== undefined}
			<div class="slider-buffer" style="--slider-buffer-percentage: {bufferPercentage}%"></div>
		{/if}
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
</div>

{#snippet sliderThumb(
	attrs: Record<string, unknown> | undefined = undefined,
	attach: Attachment | undefined = undefined
)}
	<div
		{...attrs}
		class={['slider-thumb', attrs?.class]}
		{@attach attach}
		bind:this={thumbRef}
		bind:clientWidth={thumbClientWidth}
	>
		<!-- The field: where the thumb is, so its focus and validation message are too. -->
		<input
			{...attributes}
			{id}
			class="native-field"
			type="range"
			min={_range.min}
			max={_range.max}
			step={_range.step}
			{disabled}
			aria-label={named ? attributes['aria-label'] : 'Slider'}
			aria-orientation={orientation}
			aria-valuetext={prefix || suffix ? `${prefix}${value}${suffix}` : attributes['aria-valuetext']}
			{defaultValue}
			bind:value
			bind:this={ref}
			onkeydown={(e) => invokeHandlers(e, [disabled], [handleArrowKeys, onkeydown])}
		/>
	</div>
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

		& .slider-thumb:has(> .native-field:focus-visible) {
			outline: 0.125rem var(--fs-focus-stroke-outer) solid;
			outline-offset: 0.125rem;
		}

		&:has(.native-field:is(:user-invalid, [aria-invalid='true'])) {
			& .slider-track,
			& .slider-thumb::before {
				background-color: var(--fs-system-critical);
			}
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

		&:is(.disabled, :has(.native-field:disabled)) {
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
		position: relative;
		align-items: center;
		overflow: hidden;
		border-radius: 50px;
		background-color: var(--fs-control-strong-default);
	}

	.slider-track {
		position: relative;
		background-color: var(--fs-accent-fill-default);
	}

	/* The buffer starts where the track starts, under it. */
	.slider-buffer {
		position: absolute;
		background-color: var(--fs-text-secondary);
		.orientation-horizontal & {
			inset-block: 0;
			inset-inline-start: 0;
			inline-size: var(--slider-buffer-percentage);
		}
		.orientation-horizontal.reverse & {
			inset-inline-start: auto;
			inset-inline-end: 0;
		}
		.orientation-vertical & {
			inset-inline: 0;
			inset-block-end: 0;
			block-size: var(--slider-buffer-percentage);
		}
		.orientation-vertical.reverse & {
			inset-block-end: auto;
			inset-block-start: 0;
		}
		.disabled & {
			background-color: var(--fs-control-strong-disabled);
		}
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

	.native-field {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		margin: 0;
		opacity: 0;
		pointer-events: none;
	}

	.slider-thumb {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		z-index: 1;
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
