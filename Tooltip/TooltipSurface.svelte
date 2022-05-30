<script>import { createEventForwarder } from "../internal";
import { get_current_component } from "svelte/internal";
/** Specifies a custom class name for the surface. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the surface element. */
export let element = null;
const forwardEvents = createEventForwarder(get_current_component());
</script>

<div
	class="tooltip {className}"
	role="tooltip"
	use:forwardEvents
	bind:this={element}
	{...$$restProps}
>
	<slot />
</div>

<style>.tooltip{align-items:center;background-clip:padding-box;background-color:var(--fds-solid-background-quarternary);border:1px solid var(--fds-surface-stroke-flyout);border-radius:var(--fds-control-corner-radius);box-shadow:var(--fds-tooltip-shadow);box-sizing:border-box;display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;inline-size:-webkit-max-content;inline-size:-moz-max-content;inline-size:max-content;justify-content:center;line-height:20px;max-inline-size:320px;padding-block:5px 7px;padding-inline:8px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}</style>
