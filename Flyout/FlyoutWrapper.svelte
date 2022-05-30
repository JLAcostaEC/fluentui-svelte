<script>import { createEventDispatcher } from "svelte";
import { uid, focusTrap, getCSSDuration } from "../internal";
import { fade } from "svelte/transition";
import { circOut } from "svelte/easing";
import FlyoutSurface from "./FlyoutSurface.svelte";
/** Determines the flyout's visibility. */
export let open = false;
/** Determines if the flyout can be closed using conventional user interaction. */
export let closable = true;
/** Direction that the flyout will be opened from. */
export let placement = "top";
/** Alignment of the menu along the clickable target's given axis. */
export let alignment = "center";
/** Distance of the flyout from the control button in pixels. */
export let offset = 4;
/** Determines if keyboard focus should be locked to the dialog's contents. */
export let trapFocus = true;
/** Specifies a custom class name for the content wrapper. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the content wrapper element. */
export let wrapperElement = null;
/** Obtains a bound DOM reference to the menu's positioning anchor element. */
export let anchorElement = null;
/** Obtains a bound DOM reference to the inner menu element. */
export let menuElement = null;
/** Obtains a bound DOM reference to the menu backdrop, which is present while the menu is `open`. */
export let backdropElement = null;
const dispatch = createEventDispatcher();
const menuId = uid("fds-flyout-anchor-");
$: _focusTrap = trapFocus ? focusTrap : () => { };
$: if (open) {
    dispatch("open");
}
else {
    dispatch("close");
}
function handleEscapeKey({ key }) {
    if (key === "Escape" && closable)
        open = false;
}
function closeFlyout() {
    if (closable)
        open = false;
}
</script>

<!--
@component
Flyouts represent a control that displays lightweight UI that is either information, or requires user interaction. Unlike a dialog, a Flyout can be dismissed by clicking or tapping outside of it, or pressing the Esc key. [Docs](https://fluent-svelte.vercel.app/docs/components/flyout)
- Usage:
    ```tsx
    <Flyout>
        <Button>Trigger Button</Button>
        <svelte:fragment slot="flyout">
            Flyout Contents
        </svelte:fragment>
    </Flyout>
    ```
-->

<svelte:window on:keydown={handleEscapeKey} />

<div
	class="flyout-wrapper {className}"
	aria-expanded={open}
	aria-haspopup={open}
	aria-controls={menuId}
	on:click={() => (open = !open)}
	bind:this={wrapperElement}
>
	<slot />
	{#if open}
		<div
			id={menuId}
			class="flyout-anchor placement-{placement} alignment-{alignment}"
			style="--fds-flyout-offset: {offset}px;"
			use:_focusTrap
			out:fade|local={{
				duration: getCSSDuration("--fds-control-faster-duration"),
				easing: circOut
			}}
			bind:this={anchorElement}
			on:click={e => e.stopPropagation()}
			{...$$restProps}
		>
			<slot name="override">
				<FlyoutSurface bind:element={menuElement}>
					<slot name="flyout" />
				</FlyoutSurface>
			</slot>
		</div>
		<div
			class="flyout-backdrop"
			bind:this={backdropElement}
			on:click={e => e.stopPropagation()}
			on:mousedown={closeFlyout}
		/>
	{/if}
</div>

<style>@-webkit-keyframes flyout-in{0%{opacity:0;transform:var(--fds-flyout-transform) var(--fds-flyout-transition-offset,translateY(12px))}to{opacity:1;transform:var(--fds-flyout-transform)}}@keyframes flyout-in{0%{opacity:0;transform:var(--fds-flyout-transform) var(--fds-flyout-transition-offset,translateY(12px))}to{opacity:1;transform:var(--fds-flyout-transform)}}.flyout-wrapper{block-size:-webkit-fit-content;block-size:-moz-fit-content;block-size:fit-content;display:inline-block;inline-size:-webkit-fit-content;inline-size:-moz-fit-content;inline-size:fit-content;position:relative}.flyout-backdrop{block-size:100%;inline-size:100%;left:0;position:fixed;top:0;z-index:9999}.flyout-anchor{-webkit-animation:flyout-in var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing);animation:flyout-in var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing);position:absolute;transform:var(--fds-flyout-transform);z-index:10000}.flyout-anchor.placement-top{--fds-flyout-transition-offset:translateY(12px);bottom:calc(100% + var(--fds-flyout-offset))}.flyout-anchor.placement-bottom{--fds-flyout-transition-offset:translateY(-12px);top:calc(100% + var(--fds-flyout-offset))}.flyout-anchor.placement-left{--fds-flyout-transition-offset:translateX(12px);right:calc(100% + var(--fds-flyout-offset))}.flyout-anchor.placement-right{--fds-flyout-transition-offset:translateX(-12px);left:calc(100% + var(--fds-flyout-offset))}.flyout-anchor.placement-bottom.alignment-start,.flyout-anchor.placement-top.alignment-start{inset-inline-start:0}.flyout-anchor.placement-bottom.alignment-end,.flyout-anchor.placement-top.alignment-end{inset-inline-end:0}.flyout-anchor.placement-bottom.alignment-center,.flyout-anchor.placement-top.alignment-center{--fds-flyout-transform:translateX(-50%);inset-inline-start:50%}.flyout-anchor.placement-left.alignment-start,.flyout-anchor.placement-right.alignment-start{inset-block-start:0}.flyout-anchor.placement-left.alignment-end,.flyout-anchor.placement-right.alignment-end{inset-block-end:0}.flyout-anchor.placement-left.alignment-center,.flyout-anchor.placement-right.alignment-center{--fds-flyout-transform:translateY(-50%);inset-block-start:50%}</style>
