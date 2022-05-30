<script>import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
/** Specifies a custom class name for the surface. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the surface element. */
export let element = null;
const forwardEvents = createEventForwarder(get_current_component());
</script>

<div class="flyout {className}" use:forwardEvents bind:this={element} {...$$restProps}>
	<slot />
</div>

<style>.flyout{background-clip:padding-box;background-color:var(--fds-solid-background-quarternary);border:1px solid var(--fds-surface-stroke-flyout);border-radius:var(--fds-overlay-corner-radius);box-shadow:var(--fds-flyout-shadow);box-sizing:border-box;color:var(--fds-text-primary);font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;min-inline-size:280px;padding:16px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}</style>
