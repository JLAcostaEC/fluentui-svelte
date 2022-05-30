<script>import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
/** Bindable value representing a group of radio inputs that the input will be bound to. */
export let group = undefined;
/** Controls whether the radio is checked or not. Only valid is `group` is not bound. */
export let checked = false;
/** Sets the input element's native `value` attribute for usage in forms. */
export let value = undefined;
/** Controls whether the radio is intended for user interaction, and styles it accordingly. */
export let disabled = false;
/** Specifies a custom class name for the radio. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the checkbox's <input /> element. */
export let inputElement = null;
/** Obtains a bound DOM reference to the checkbox's outer container element. */
export let containerElement = null;
const forwardEvents = createEventForwarder(get_current_component());
</script>

<!--
@component
Radio buttons, also called option buttons, let users select one option from a collection of two or more mutually exclusive, but related, options. The singular behavior of a RadioButtons group distinguishes it from check boxes, which support multi-selection and deselection, or clearing. [Docs](https://fluent-svelte.vercel.app/docs/components/radiobutton)
- Usage:
    ```tsx
    <script>
        import { RadioButton } from "fluent-svelte";

        let flavor = "chocolate";
    </script>

    <RadioButton bind:group={flavor} value="chocolate">Chocolate</RadioButton>
    <RadioButton bind:group={flavor} value="vanilla">Vanilla</RadioButton>
    <RadioButton bind:group={flavor} value="strawberry">Strawberry</RadioButton>
    ```
-->
<label class="radio-button-container" bind:this={containerElement}>
	<input
		use:forwardEvents
		type="radio"
		class="radio-button {className}"
		bind:group
		bind:this={inputElement}
		{value}
		{checked}
		{disabled}
		{...$$restProps}
	/>
	{#if $$slots.default}
		<span>
			<slot />
		</span>
	{/if}
</label>

<style>.radio-button{align-items:center;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-clip:padding-box;background-color:var(--fds-control-alt-fill-secondary);block-size:20px;border:1px solid var(--fds-control-strong-stroke-default);border-radius:20px;display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;inline-size:20px;justify-content:center;line-height:20px;margin:0;outline:none;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.radio-button:before{background-color:var(--fds-text-on-accent-primary);block-size:4px;border-radius:12px;content:"";inline-size:4px;position:absolute;visibility:hidden}.radio-button:focus-visible{box-shadow:var(--fds-focus-stroke)}.radio-button:hover{background-color:var(--fds-control-alt-fill-tertiary)}.radio-button:active{background-color:var(--fds-control-alt-fill-quarternary);border-color:var(--fds-control-strong-stroke-disabled)}.radio-button:active:before{block-size:10px;inline-size:10px;transition:var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing);visibility:visible}.radio-button:disabled{background-color:var(--fds-control-alt-fill-disabled);border-color:var(--fds-control-strong-stroke-disabled)}.radio-button:disabled:before{visibility:hidden}.radio-button:disabled+span{color:var(--fds-text-disabled)}.radio-button:checked{background-color:var(--fds-accent-default);border:none}.radio-button:checked:before{block-size:12px;box-shadow:0 0 0 1px var(--fds-control-stroke-default);inline-size:12px;transition:var(--fds-control-normal-duration) var(--fds-control-fast-out-slow-in-easing);visibility:visible}.radio-button:checked:hover{background-color:var(--fds-accent-secondary)}.radio-button:checked:hover:before{block-size:14px;inline-size:14px}.radio-button:checked:active{background-color:var(--fds-accent-tertiary)}.radio-button:checked:active:before{block-size:10px;inline-size:10px}.radio-button:checked:disabled{background-color:var(--fds-accent-disabled)}.radio-button:checked:disabled:before{block-size:12px;box-shadow:none;inline-size:12px}.radio-button-container{align-items:center;color:var(--fds-text-primary);display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;line-height:20px;min-block-size:32px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.radio-button-container>span{-webkit-padding-start:8px;padding-inline-start:8px}</style>
