<script>import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
/** Controls whether the switch is toggled or not. */
export let checked = false;
/** Sets the input element's native `value` attribute for usage in forms. */
export let value = undefined;
/** Controls whether the switch is intended for user interaction, and styles it accordingly. */
export let disabled = false;
/** Specifies a custom class name for the switch. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the switch's <input /> element. */
export let inputElement = null;
/** Obtains a bound DOM reference to the switch's outer container element. */
export let containerElement = null;
const forwardEvents = createEventForwarder(get_current_component());
</script>

<!--
@component
The toggle switch represents a physical switch that allows users to turn things on or off, like a light switch. Use toggle switch controls to present users with two mutually exclusive options (such as on/off), where choosing an option provides immediate results. [Docs](https://fluent-svelte.vercel.app/docs/components/radiobutton)
- Usage:
    ```tsx
    <ToggleSwitch bind:checked />
    ```
-->
<label class="toggle-switch-container" bind:this={containerElement}>
	<input
		use:forwardEvents
		class="toggle-switch {className}"
		type="checkbox"
		bind:checked
		bind:this={inputElement}
		{value}
		{disabled}
		{...$$restProps}
	/>
	{#if $$slots.default}
		<span>
			<slot />
		</span>
	{/if}
</label>

<style>.toggle-switch{align-items:center;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--fds-control-alt-fill-secondary);block-size:20px;border:1px solid var(--fds-control-strong-stroke-default);border-radius:20px;display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;inline-size:40px;line-height:20px;margin:0;outline:none;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.toggle-switch:before{background-color:var(--fds-text-secondary);block-size:12px;border-radius:7px;content:"";inline-size:12px;inset-inline-start:3px;position:absolute;transition:var(--fds-control-fast-duration) ease-in-out transform,var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) height,var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) width,var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) margin,var(--fds-control-faster-duration) linear background}.toggle-switch:focus-visible{box-shadow:var(--fds-focus-stroke)}.toggle-switch:hover{background-color:var(--fds-control-alt-fill-tertiary)}.toggle-switch:hover:before{block-size:14px;inline-size:14px}.toggle-switch:active{background-color:var(--fds-control-alt-fill-quarternary)}.toggle-switch:active:before{block-size:14px;inline-size:17px}.toggle-switch:disabled{background-color:var(--fds-control-alt-fill-disabled);border-color:var(--fds-control-strong-stroke-disabled)}.toggle-switch:disabled:before{background-color:var(--fds-text-disabled);block-size:12px;box-shadow:none;inline-size:12px;margin:0!important}.toggle-switch:disabled+span{color:var(--fds-text-disabled)}.toggle-switch:checked{background-color:var(--fds-accent-default);border:none}.toggle-switch:checked:before{background-color:var(--fds-text-on-accent-primary);box-shadow:0 0 0 1px solid var(--fds-control-stroke-default);transform:translateX(20px)}.toggle-switch:checked:hover{background-color:var(--fds-accent-secondary)}.toggle-switch:checked:hover:before{-webkit-margin-start:-1px;margin-inline-start:-1px}.toggle-switch:checked:active{background-color:var(--fds-accent-tertiary)}.toggle-switch:checked:active:before{-webkit-margin-start:-4px;margin-inline-start:-4px}.toggle-switch:checked:disabled{background-color:var(--fds-accent-disabled)}.toggle-switch:checked:disabled:before{background-color:var(--fds-text-on-accent-disabled);box-shadow:none}.toggle-switch-container{align-items:center;color:var(--fds-text-primary);display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;min-block-size:32px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.toggle-switch-container>span{-webkit-padding-start:8px;padding-inline-start:8px}</style>
