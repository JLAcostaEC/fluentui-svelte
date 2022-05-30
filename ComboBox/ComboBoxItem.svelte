<script>import { createEventForwarder } from "../internal";
import { get_current_component } from "svelte/internal";
export let selected = false;
export let disabled = false;
let className = "";
export { className as class };
const forwardEvents = createEventForwarder(get_current_component());
</script>

<li
	use:forwardEvents
	tabindex="0"
	class="combo-box-item {className}"
	class:selected
	class:disabled
	{...$$restProps}
>
	<slot name="icon" />
	<span>
		<slot />
	</span>
</li>

<style>.combo-box-item{align-items:center;background-color:var(--fds-subtle-fill-transparent);block-size:32px;border-radius:var(--fds-control-corner-radius);box-sizing:border-box;color:var(--fds-text-primary);cursor:default;display:flex;flex:0 0 auto;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;margin:4px;outline:none;padding:0 11px;position:relative;text-decoration:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.combo-box-item:before{background-color:var(--fds-accent-default);block-size:0;border-radius:3px;content:"";inline-size:3px;inset-inline-start:0;opacity:0;position:absolute;transition:transform var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing)}.combo-box-item:focus-visible{box-shadow:var(--fds-focus-stroke)}.combo-box-item.selected,.combo-box-item:hover{background-color:var(--fds-subtle-fill-secondary)}.combo-box-item:active{background-color:var(--fds-subtle-fill-tertiary);color:var(--fds-text-secondary)}.combo-box-item:active:before{transform:scaleY(.625)}.combo-box-item.disabled{background-color:var(--fds-subtle-fill-transparent);color:var(--fds-text-disabled);pointer-events:none}.combo-box-item.disabled.selected{background-color:var(--fds-subtle-fill-secondary)}.combo-box-item.disabled.selected:before{background-color:var(--fds-accent-disabled)}.combo-box-item.selected:before{block-size:16px;opacity:1}.combo-box-item>span{flex:1 1 auto;max-inline-size:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.combo-box-item>:global(svg){fill:currentColor;-webkit-margin-end:16px;block-size:auto;inline-size:16px;margin-inline-end:16px}</style>
