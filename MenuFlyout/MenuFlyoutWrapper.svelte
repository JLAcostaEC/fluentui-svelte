<script>import { tabbable } from "tabbable";
import { createEventDispatcher, setContext } from "svelte";
import { arrowNavigation, uid } from "../internal";
import MenuFlyoutSurface from "./MenuFlyoutSurface.svelte";
/** Determines the flyout's visibility. */
export let open = false;
/** Determines if the flyout can be closed using conventional user interaction. */
export let closable = true;
/** Controls if the flyout will be closed when clicking a standard variant item. Only applies if `closable` is set to `true`. */
export let closeOnSelect = true;
/** Direction that the flyout will be opened from. */
export let placement = "top";
/** Alignment of the menu along the clickable target's given axis. */
export let alignment = "center";
/** Distance of the flyout from the control button in pixels. */
export let offset = 4;
/** Specifies a custom class name for the flyout. */
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
const menuId = uid("fds-menu-flyout-anchor-");
let menu = null;
let previousFocus = null;
$: dispatch(open ? "open" : "close");
$: if (menu && tabbable(menuElement).length > 0)
    tabbable(menuElement)[0].focus();
function handleEscapeKey({ key }) {
    if (key === "Escape" && closable)
        open = false;
    previousFocus === null || previousFocus === void 0 ? void 0 : previousFocus.focus();
}
function toggleFlyout() {
    previousFocus = document.activeElement;
    open = !open;
}
function closeFlyout() {
    if (closable)
        open = false;
}
setContext("closeFlyout", event => {
    dispatch("select");
    if (closeOnSelect && closable) {
        event.stopPropagation();
        open = false;
    }
});
</script>

<svelte:window on:keydown={handleEscapeKey} />

<div
	class="menu-flyout-wrapper {className}"
	aria-expanded={open}
	aria-haspopup={open}
	aria-controls={menuId}
	on:click={toggleFlyout}
	bind:this={wrapperElement}
>
	<slot />
	{#if open}
		<div
			id={menuId}
			class="menu-flyout-anchor placement-{placement} alignment-{alignment}"
			style="--fds-menu-flyout-offset: {offset}px;"
			tabindex="-1"
			bind:this={anchorElement}
			use:arrowNavigation={{ preventTab: true }}
			on:click={e => e.stopPropagation()}
		>
			<MenuFlyoutSurface bind:element={menuElement} bind:this={menu} {...$$restProps}>
				<slot name="flyout" />
			</MenuFlyoutSurface>
		</div>
		<div
			class="menu-flyout-backdrop"
			bind:this={backdropElement}
			on:click={e => e.stopPropagation()}
			on:mousedown={closeFlyout}
		/>
	{/if}
</div>

<style>.menu-flyout-wrapper{display:inline-block;height:auto;position:relative}.menu-flyout-backdrop{height:100%;left:0;position:fixed;top:0;width:100%;z-index:9999}.menu-flyout-anchor{position:absolute;z-index:10000}.menu-flyout-anchor.placement-top{--fds-menu-flyout-transition-offset:50%;bottom:calc(100% + var(--fds-menu-flyout-offset))}.menu-flyout-anchor.placement-bottom{top:calc(100% + var(--fds-menu-flyout-offset))}.menu-flyout-anchor.placement-left{right:calc(100% + var(--fds-menu-flyout-offset))}.menu-flyout-anchor.placement-right{left:calc(100% + var(--fds-menu-flyout-offset))}.menu-flyout-anchor.placement-bottom.alignment-start,.menu-flyout-anchor.placement-top.alignment-start{inset-inline-start:0}.menu-flyout-anchor.placement-bottom.alignment-end,.menu-flyout-anchor.placement-top.alignment-end{inset-inline-end:0}.menu-flyout-anchor.placement-bottom.alignment-center,.menu-flyout-anchor.placement-top.alignment-center{inset-inline-start:50%;transform:translateX(-50%)}.menu-flyout-anchor.placement-left.alignment-start,.menu-flyout-anchor.placement-right.alignment-start{inset-block-start:0}.menu-flyout-anchor.placement-left.alignment-end,.menu-flyout-anchor.placement-right.alignment-end{inset-block-end:0}.menu-flyout-anchor.placement-left.alignment-center,.menu-flyout-anchor.placement-right.alignment-center{inset-block-start:50%;transform:translateY(-50%)}</style>
