<script>import { createEventDispatcher } from "svelte";
import { get_current_component } from "svelte/internal";
import { fade, scale } from "svelte/transition";
import { circOut } from "svelte/easing";
import { uid, focusTrap, getCSSDuration, createEventForwarder } from "../internal";
import TextBlock from "../TextBlock/TextBlock.svelte";
/** Determines whether the dialog is open or not. */
export let open = false;
/** Title text displayed as the dialog header. */
export let title = "";
/** Specifies the visual size of the dialog. */
export let size = "standard";
/** Determines whether the dialog can be conventially closed using the escape key. */
export let closable = true;
/** Determines the node the dialog should be appended to. */
export let append = undefined;
/** Determines if the dialog should darken the contents behind it. */
export let darken = true;
/** Determines if keyboard focus should be locked to the dialog's contents. */
export let trapFocus = true;
/** Specifies a custom class name for the dialog. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the inner dialog element. */
export let element = null;
/** Obtains a bound DOM reference to the dialog's backdrop container element. */
export let backdropElement = null;
/** Obtains a bound DOM reference to the dialog's inner body element. */
export let bodyElement = null;
/** Obtains a bound DOM reference to the dialog's footer element. */
export let footerElement = null;
const forwardEvents = createEventForwarder(get_current_component(), [
    "open",
    "close",
    "backdropclick",
    "backdropmousedown"
]);
const dispatch = createEventDispatcher();
const titleId = uid("fds-dialog-title-");
const bodyId = uid("fds-dialog-body-");
$: if (!open)
    dispatch("close");
$: _focusTrap = trapFocus ? focusTrap : () => { };
function mountDialog(node) {
    dispatch("open");
    if (append)
        append.appendChild(node);
    node.focus();
}
function close() {
    open = false;
}
function handleEscapeKey({ key }) {
    if (key === "Escape" && open && closable)
        close();
}
</script>

<svelte:window on:keydown={handleEscapeKey} />

{#if open}
	<div
		class="content-dialog-smoke"
		class:darken
		on:click|self={e => dispatch("backdropclick", e)}
		on:mousedown|self={e => dispatch("backdropmousedown", e)}
		transition:fade|local={{ duration: getCSSDuration("--fds-control-faster-duration") }}
		use:mountDialog
		use:_focusTrap
		bind:this={backdropElement}
	>
		<div
			use:forwardEvents
			class="content-dialog size-{size} {className}"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title && titleId}
			aria-describedby={bodyId}
			bind:this={element}
			transition:scale|local={{
				duration: getCSSDuration("--fds-control-fast-duration"),
				start: 1.05,
				easing: circOut
			}}
			{...$$restProps}
		>
			<div class="content-dialog-body" id={bodyId} bind:this={bodyElement}>
				{#if title}
					<TextBlock variant="subtitle" class="content-dialog-title" id={titleId}>
						{title}
					</TextBlock>
				{/if}
				<slot />
			</div>
			{#if $$slots.footer}
				<footer class="content-dialog-footer" bind:this={footerElement}>
					<slot name="footer" />
				</footer>
			{/if}
		</div>
		<slot name="outer" />
	</div>
{/if}

<style>.content-dialog{-webkit-animation:dialog-inner var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing);animation:dialog-inner var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing);background-clip:padding-box;background-color:var(--fds-solid-background-base);border:1px solid var(--fds-surface-stroke-default);border-radius:var(--fds-overlay-corner-radius);box-shadow:var(--fds-dialog-shadow);box-sizing:border-box;max-inline-size:calc(100% - 24px);overflow:hidden;position:fixed}.content-dialog.size-min{inline-size:320px}.content-dialog.size-standard{inline-size:448px}.content-dialog.size-max{inline-size:540px}.content-dialog-smoke{align-items:center;block-size:100%;display:flex;flex-direction:column;inline-size:100%;inset-block-start:0;inset-inline-start:0;justify-content:center;position:fixed;z-index:101}.content-dialog-smoke.darken{background-color:var(--fds-smoke-background-default)}.content-dialog :global(.content-dialog-title){color:var(--fds-text-primary);display:block;margin-bottom:12px}.content-dialog-body,.content-dialog-footer{padding:24px}.content-dialog-body{background-color:var(--fds-layer-background-default);color:var(--fds-text-primary);font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.content-dialog-footer{grid-gap:8px;-webkit-border-before:1px solid var(--fds-card-stroke-default);border-block-start:1px solid var(--fds-card-stroke-default);display:grid;grid-auto-flow:column;grid-auto-rows:1fr;white-space:nowrap}.content-dialog-footer>:global(.button:only-child){inline-size:50%;justify-self:end}</style>
