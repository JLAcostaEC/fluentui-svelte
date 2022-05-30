<script>import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
/** @restProps {button | a} */
/** Specifies the visual styling of the button. */
export let variant = "standard";
/** Sets an href value and converts the button element into an anchor/ */
export let href = "";
/** Controls whether the button is intended for user interaction, and styles it accordingly. */
export let disabled = false;
/** Specifies a custom class name for the button. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the button or anchor element. */
export let element = null;
const forwardEvents = createEventForwarder(get_current_component());
</script>

<!--
@component
A button gives the user a way to trigger an immediate action. Some buttons are specialized for particular tasks, such as navigation, repeated actions, or presenting menus. [Docs](https://fluent-svelte.vercel.app/docs/components/button)
- Usage:
    ```tsx
    <Button>Click me!</Button>
    ```
-->
<svelte:element
    use:forwardEvents
    bind:this={element}
    this={href && !disabled ? "a" : "button"}
    role={(href && !disabled) ? "button" : undefined}
    href={(href && !disabled) ? href : undefined}
    class="button style-{variant} {className}"
    class:disabled
    {...$$restProps}
>
    <slot />
</svelte:element>

<style>.button{align-items:center;border:none;border-radius:var(--fds-control-corner-radius);box-sizing:border-box;cursor:default;display:inline-flex;font-family:var(--fds-font-family-text);font-size:var(--fds-body-font-size);font-weight:400;justify-content:center;line-height:20px;outline:none;padding-block:4px 6px;padding-inline:11px;position:relative;text-decoration:none;transition:var(--fds-control-faster-duration) ease background;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.button:focus-visible{box-shadow:var(--fds-focus-stroke)}.button.style-standard{background-clip:padding-box;background-color:var(--fds-control-fill-default);border:1px solid;border-color:var(--fds-control-border-default);color:var(--fds-text-primary)}.button.style-standard:hover{background-color:var(--fds-control-fill-secondary)}.button.style-standard:active{background-color:var(--fds-control-fill-tertiary);border-color:var(--fds-control-stroke-default);color:var(--fds-text-secondary)}.button.style-standard.disabled{background-color:var(--fds-control-fill-disabled);border-color:var(--fds-control-stroke-default);color:var(--fds-text-disabled)}.button.style-accent{background-color:var(--fds-accent-default);border:1px solid var(--fds-control-stroke-on-accent-default);border-bottom-color:var(--fds-control-stroke-on-accent-secondary);color:var(--fds-text-on-accent-primary);transition:var(--fds-control-faster-duration) ease border-color}.button.style-accent:hover{background-color:var(--fds-accent-secondary)}.button.style-accent:active{background-color:var(--fds-accent-tertiary);border-color:transparent;color:var(--fds-text-on-accent-secondary)}.button.style-accent.disabled{background-color:var(--fds-accent-disabled);border-color:transparent;color:var(--fds-text-on-accent-disabled)}.button.style-hyperlink{background-color:var(--fds-subtle-fill-transparent);color:var(--fds-accent-text-primary);cursor:pointer}.button.style-hyperlink:hover{background-color:var(--fds-subtle-fill-secondary)}.button.style-hyperlink:active{background-color:var(--fds-subtle-fill-tertiary);color:var(--fds-accent-text-tertiary)}.button.style-hyperlink.disabled{color:var(--fds-accent-text-disabled)}.button.disabled{pointer-events:none}</style>
