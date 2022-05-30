<script>import { createEventForwarder, TooltipSurface } from "../internal";
import { createEventDispatcher } from "svelte";
import { get_current_component } from "svelte/internal";
/** The slider's current value. */
export let value = 0;
/** The minimum value of the slider. */
export let min = 0;
/** The maximum value of the slider. */
export let max = 100;
/** Determines how much the slider's value should increase per step. */
export let step = 1;
/** Determines the position of slider ticks along the min and max of the track. */
export let ticks = [];
/** Determines the placement of slider ticks around the track. */
export let tickPlacement = "around";
/** Determines if the slider's value tooltip will be shown. */
export let tooltip = true;
/** Text placed before the slider's value tooltip. */
export let prefix = "";
/** Text placed after the slider's value tooltip. */
export let suffix = "";
/** Determines if the slider's fill track will be visible or not. */
export let track = true;
/** Determines the slider's orientation. */
export let orientation = "horizontal";
/** Determines if the slider track will be in reverse direction. */
export let reverse = false;
/** Controls whether the slider is disabled. */
export let disabled = false;
/** Specifies a custom class name for the slider's container element. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the slider's input element. */
export let inputElement = null;
/** Obtains a bound DOM reference to the slider's outer container element. */
export let containerElement = null;
/** Obtains a bound DOM reference to the slider's tick container element. */
export let tickBarElement = null;
/** Obtains a bound DOM reference to the slider's thumb element. */
export let thumbElement = null;
/** Obtains a bound DOM reference to the slider's outer rail element. */
export let railElement = null;
/** Obtains a bound DOM reference to the slider's track (fill) element. */
export let trackElement = null;
let dragging = false;
let holding = false;
let directionAwareReverse = false;
let thumbClientWidth = 20;
$: if (containerElement) {
    directionAwareReverse =
        (window === null || window === void 0 ? void 0 : window.getComputedStyle(containerElement).direction) === "ltr" ? reverse : !reverse;
}
const dispatch = createEventDispatcher();
const forwardEvents = createEventForwarder(get_current_component(), [
    "input",
    "change",
    "beforeinput"
]);
// Divides the current value minus the minimum value
// by the difference between the max and min values,
// and multiplies by 100 to get a percentage.
const valueToPercentage = v => ((v - min) / (max - min)) * 100;
function cancelMove() {
    holding = false;
    dragging = false;
}
function handleMove() {
    if (holding)
        dragging = true;
}
function calculateValue(event) {
    if (disabled || !railElement)
        return;
    const { top, bottom, left, right, width, height } = railElement.getBoundingClientRect();
    const percentageX = event.touches ? event.touches[0].clientX : event.clientX;
    const percentageY = event.touches ? event.touches[0].clientY : event.clientY;
    const position = orientation === "horizontal" ? percentageX : percentageY;
    const startingPos = orientation === "horizontal"
        ? directionAwareReverse
            ? right
            : left
        : directionAwareReverse
            ? top
            : bottom;
    const length = orientation === "horizontal" ? width : height;
    let nextStep = min +
        Math.round(((max - min) *
            ((position - startingPos) / length) *
            (directionAwareReverse ? -1 : 1) *
            (orientation === "vertical" ? -1 : 1)) /
            step) *
            step;
    if (nextStep <= min)
        nextStep = min;
    else if (nextStep >= max)
        nextStep = max;
    value = nextStep;
}
function handleArrowKeys(event) {
    const { key } = event;
    if (key === "ArrowDown" || key === "ArrowUp")
        event.preventDefault();
    if (key === "ArrowLeft" || (key === "ArrowDown" && !disabled)) {
        if (reverse) {
            stepUp();
        }
        else {
            stepDown();
        }
    }
    else if (key === "ArrowRight" || (key === "ArrowUp" && !disabled)) {
        if (reverse) {
            stepDown();
        }
        else {
            stepUp();
        }
    }
}
function handleTouchStart(event) {
    if (event.cancelable)
        event.preventDefault();
    holding = true;
}
function linearScale(input, output) {
    return (value) => {
        if (input[0] === input[1] || output[0] === output[1])
            return output[0];
        const ratio = (output[1] - output[0]) / (input[1] - input[0]);
        return output[0] + ratio * (value - input[0]);
    };
}
export function stepUp() {
    value += step;
    if (value > max)
        value = max;
}
export function stepDown() {
    value -= step;
    if (value < min)
        value = min;
}
$: dispatch("change", value);
$: percentage = valueToPercentage(value);
$: {
    if (value <= min)
        value = min;
    else if (value >= max)
        value = max;
    if (dragging) {
        calculateValue(event);
        dragging = false;
    }
}
</script>

<svelte:window
	on:mousemove={handleMove}
	on:touchmove={handleMove}
	on:mouseup={cancelMove}
	on:touchend={cancelMove}
	on:touchcancel={cancelMove}
/>

<!--
@component
A slider is a control that lets the user select from a range of values by moving a thumb control along a track. [Docs](https://fluent-svelte.vercel.app/docs/components/slider)
- Usage:
    ```tsx
    <Slider bind:value min={-100} max={100} step={10} ticks={[-50, 0, 50]} />
    ```
-->
<div
	use:forwardEvents
	on:mousedown|preventDefault={() => {
		holding = true;
		dragging = true;
	}}
	on:touchstart={handleTouchStart}
	on:keydown={handleArrowKeys}
	tabindex={disabled ? -1 : 0}
	style="--fds-slider-percentage: {percentage}%; --fds-slider-thumb-offset: {thumbClientWidth /
		2 -
		linearScale([0, 50], [0, thumbClientWidth / 2])(percentage)}px;"
	class="slider orientation-{orientation} {className}"
	class:disabled
	class:reverse={directionAwareReverse}
	bind:this={containerElement}
	{...$$restProps}
>
	<div
		class="slider-thumb"
		role="slider"
		aria-valuemin={min}
		aria-valuemax={max}
		aria-valuenow={value}
		bind:this={thumbElement}
		bind:clientWidth={thumbClientWidth}
	>
		{#if tooltip && !disabled}
			<TooltipSurface class="slider-tooltip">
				<slot name="tooltip" {prefix} {suffix} {value}>
					{prefix}{value}{suffix}
				</slot>
			</TooltipSurface>
		{/if}
	</div>

	<div class="slider-rail" bind:this={railElement}>
		{#if track}
			<div class="slider-track" bind:this={trackElement} />
		{/if}
	</div>

	{#if ticks}
		<div class="slider-tick-bar placement-{tickPlacement}" bind:this={tickBarElement}>
			{#each ticks as tick}
				<div
					class="slider-tick"
					style="--fds-slider-tick-percentage: {valueToPercentage(tick)}%"
				/>
			{/each}
		</div>
	{/if}

	<input type="range" hidden {min} {max} {step} {disabled} {value} bind:this={inputElement} />
</div>

<style>.slider{align-items:center;border-radius:var(--fds-control-corner-radius);display:flex;justify-content:center;min-block-size:32px;min-inline-size:32px;position:relative}.slider>:global(*){direction:ltr}.slider:focus-visible{box-shadow:var(--fds-focus-stroke);outline:none}.slider-thumb:active :global(.slider-tooltip),.slider:active :global(.slider-tooltip),.slider:focus-visible :global(.slider-tooltip){opacity:1}.slider.orientation-horizontal{block-size:32px;inline-size:100%}.slider.orientation-horizontal .slider-rail{block-size:4px;inline-size:100%;justify-content:flex-start}.slider.orientation-horizontal .slider-track{block-size:100%;inline-size:var(--fds-slider-percentage)}.slider.orientation-horizontal .slider-thumb{inset-inline-start:calc(var(--fds-slider-percentage) + var(--fds-slider-thumb-offset));transform:translateX(-50%)}.slider.orientation-horizontal .slider-tick{flex-direction:column;height:100%;inset-inline-start:var(--fds-slider-tick-percentage);padding:6px 0}.slider.orientation-horizontal .slider-tick:after,.slider.orientation-horizontal .slider-tick:before{-webkit-border-start:1px solid var(--fds-control-strong-fill-default);border-inline-start:1px solid var(--fds-control-strong-fill-default);height:4px;width:1px}.slider.orientation-horizontal.reverse .slider-rail{justify-content:flex-end}.slider.orientation-horizontal.reverse .slider-thumb{inset-inline-end:calc(var(--fds-slider-percentage) + var(--fds-slider-thumb-offset));inset-inline-start:unset;transform:translateX(50%)}.slider.orientation-horizontal.reverse .slider-tick{inset-inline-end:var(--fds-slider-tick-percentage);inset-inline-start:unset}.slider.orientation-vertical{block-size:100%;inline-size:32px}.slider.orientation-vertical .slider-rail{align-items:flex-end;block-size:100%;inline-size:4px}.slider.orientation-vertical .slider-track{block-size:var(--fds-slider-percentage);inline-size:100%}.slider.orientation-vertical .slider-thumb{inset-block-end:calc(var(--fds-slider-percentage) + var(--fds-slider-thumb-offset));transform:translateY(50%)}.slider.orientation-vertical .slider-tick{inset-block-end:var(--fds-slider-tick-percentage);padding:0 6px;width:100%}.slider.orientation-vertical .slider-tick:after,.slider.orientation-vertical .slider-tick:before{-webkit-border-before:1px solid var(--fds-control-strong-fill-default);border-block-start:1px solid var(--fds-control-strong-fill-default);height:1px;width:4px}.slider.orientation-vertical.reverse .slider-rail{align-items:flex-start}.slider.orientation-vertical.reverse .slider-thumb{inset-block-end:unset;inset-block-start:calc(var(--fds-slider-percentage) + var(--fds-slider-thumb-offset));transform:translateY(-50%)}.slider.orientation-vertical.reverse .slider-tick{inset-block-end:unset;inset-block-start:var(--fds-slider-tick-percentage)}.slider.disabled .slider-rail,.slider.disabled .slider-thumb:before,.slider.disabled .slider-track{background-color:var(--fds-accent-disabled)}.slider.disabled .slider-thumb:before{transform:none}.slider.disabled .slider-tick:after,.slider.disabled .slider-tick:before{border-color:var(--fds-control-fill-disabled)}.slider-rail{align-items:center;background-color:var(--fds-control-strong-fill-default);border-radius:50px;display:flex;overflow:hidden}.slider-track{background-color:var(--fds-accent-default)}.slider-tick-bar{height:100%;inset-block-start:0;inset-inline-start:0;position:absolute;width:100%;z-index:-1}.slider-tick-bar.placement-after .slider-tick:before,.slider-tick-bar.placement-before .slider-tick:after{visibility:hidden}.slider-tick{align-items:center;box-sizing:border-box;display:flex;justify-content:space-between;position:absolute}.slider-tick:after,.slider-tick:before{content:""}.slider-thumb{align-items:center;background-color:var(--fds-control-solid-fill-default);block-size:20px;box-shadow:0 0 0 1px var(--fds-control-stroke-default);display:flex;inline-size:20px;justify-content:center;z-index:10}.slider-thumb,.slider-thumb:before{border-radius:100%;position:absolute}.slider-thumb:before{background-color:var(--fds-accent-default);block-size:12px;content:"";inline-size:12px;transition:var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) transform}.slider-thumb:hover:before{transform:scale(1.167)}.slider-thumb:hover :global(.slider-tooltip){opacity:1;transition-delay:1s}.slider-thumb:active:before{background-color:var(--fds-accent-tertiary);transform:scale(.833)}.slider :global(.slider-tooltip){inset-block-end:calc(100% + 18px);inset-inline-start:50%;max-inline-size:unset;opacity:0;pointer-events:none;position:absolute;transform:translateX(-50%);transition:var(--fds-control-fast-duration) linear opacity;white-space:nowrap;z-index:100}</style>
