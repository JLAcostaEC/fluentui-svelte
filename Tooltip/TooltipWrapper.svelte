<script>import { onMount } from "svelte";
import { fade } from "svelte/transition";
import { getCSSDuration } from "../internal";
import TooltipSurface from "./TooltipSurface.svelte";
/** Specifies the tooltip's text content. */
export let text = "";
/** Distance of the tooltip from the alignment axis in pixels. */
export let offset = 24;
/** Direction that the tooltip will appear from. */
export let placement = "auto";
/** Alignment of the tooltip along the placement target's given axis. */
export let alignment = "center";
/** Allows the tooltip to follow the user's cursor if `placement` is set to `auto`. */
export let followCursor = false;
/** Prevents the tooltip from disappearing after cursor leaves bounds. */
export let persistent = false;
/** Determines if the tooltip is visible or not. */
export let visible = false;
/** Initial delay time for the tooltip to become visible in millseconds. */
export let delay = 1000;
/** Obtains a bound reference to the tooltip surface element. */
export let tooltipElement = null;
/** Obtains a bound reference to the tooltip's positioning anchor element. */
export let anchorElement = null;
/** Obtains a bound reference to the tooltip's content wrapper element. */
export let wrapperElement = null;
let mounted = false;
let tooltipDurationTimeout;
let currentPosition = {
    x: 0,
    y: 0
};
let mousePosition = {
    x: 0,
    y: 0
};
onMount(() => (mounted = true));
function updateMousePosition({ clientX, clientY }) {
    mousePosition.x = clientX;
    mousePosition.y = clientY;
}
function updateTooltipPositionAuto(wrapperPosition) {
    const { left, top } = wrapperPosition;
    currentPosition.x = mousePosition.x - left;
    currentPosition.y = mousePosition.y - top;
}
function mountTooltip() {
    tooltipDurationTimeout = setTimeout(() => {
        if (placement === "auto" && wrapperElement)
            updateTooltipPositionAuto(wrapperElement.getBoundingClientRect());
        visible = true;
    }, delay);
}
function destroyTooltip() {
    clearTimeout(tooltipDurationTimeout);
    if (!persistent)
        visible = false;
}
</script>

<svelte:window on:scroll={destroyTooltip} />

<div
	class="tooltip-wrapper"
	title={mounted ? undefined : text}
	bind:this={wrapperElement}
	on:mouseenter={mountTooltip}
	on:mouseleave={destroyTooltip}
	on:mousemove={updateMousePosition}
	on:mousemove={() =>
		placement === "auto" &&
		followCursor &&
		updateTooltipPositionAuto(wrapperElement.getBoundingClientRect())}
>
	<slot />

	{#if visible}
		<div
			bind:this={anchorElement}
			in:fade|local={{ duration: getCSSDuration("--fds-control-fast-duration") }}
			class="tooltip-anchor placement-{placement} alignment-{alignment}"
			style="{placement === 'auto'
				? `top: calc(${currentPosition.y}px - var(--fds-tooltip-offset));
				   left: ${currentPosition.x}px;`
				: ''} --fds-tooltip-offset: {offset}px"
		>
			<TooltipSurface bind:element={tooltipElement} {...$$restProps}>
				{text}
				<slot name="tooltip" />
			</TooltipSurface>
		</div>
	{/if}
</div>

<style>.tooltip-wrapper{display:block;position:relative}.tooltip-anchor{pointer-events:none;position:absolute;z-index:100}.tooltip-anchor.placement-top{bottom:calc(100% + var(--fds-tooltip-offset))}.tooltip-anchor.placement-bottom{top:calc(100% + var(--fds-tooltip-offset))}.tooltip-anchor.placement-left{right:calc(100% + var(--fds-tooltip-offset))}.tooltip-anchor.placement-right{left:calc(100% + var(--fds-tooltip-offset))}.tooltip-anchor.placement-bottom.alignment-start,.tooltip-anchor.placement-top.alignment-start{inset-inline-start:0}.tooltip-anchor.placement-bottom.alignment-end,.tooltip-anchor.placement-top.alignment-end{inset-inline-end:0}.tooltip-anchor.placement-bottom.alignment-center,.tooltip-anchor.placement-top.alignment-center{inset-inline-start:50%;transform:translateX(-50%)}.tooltip-anchor.placement-left.alignment-start,.tooltip-anchor.placement-right.alignment-start{inset-block-start:0}.tooltip-anchor.placement-left.alignment-end,.tooltip-anchor.placement-right.alignment-end{inset-block-end:0}.tooltip-anchor.placement-left.alignment-center,.tooltip-anchor.placement-right.alignment-center{inset-block-start:50%;transform:translateY(-50%)}.tooltip-anchor.placement-auto{transform:translateY(-100%)}.tooltip-anchor.placement-auto.alignment-center{transform:translate(-50%,-100%)}.tooltip-anchor.placement-auto.alignment-end{transform:translate(-100%,-100%)}</style>
