<script>import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
/** @restProps {button | a} */
/** Sets an href value and converts the button element into an anchor. */
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
An Icon Button is a clickable control that triggers an immediate action. Unlike the Button control, it serves the purpose of encapsulating an icon glyph as it’s content. [Docs](https://fluent-svelte.vercel.app/docs/components/iconbutton)
- Usage:
    ```tsx
    <IconButton>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14A6 6 0 108 2a6 6 0 000 12zm0-1A5 5 0 118 3a5 5 0 010 10z" />
        </svg>
    </IconButton>
    ```
-->
<svelte:element
    use:forwardEvents
    bind:this={element}
    this={href && !disabled ? "a" : "button"}
    role={(href && !disabled) ? "button" : undefined}
    href={(href && !disabled) ? href : undefined}
    class="icon-button {className}"
    class:disabled
    {...$$restProps}
>
    <slot />
</svelte:element>

<style>.icon-button{align-items:center;background-color:var(--fds-subtle-fill-transparent);border:none;border-radius:var(--fds-control-corner-radius);box-sizing:border-box;color:var(--fds-text-primary);display:inline-flex;justify-content:center;min-block-size:30px;min-inline-size:30px;outline:none;padding:8px}.icon-button:focus-visible{box-shadow:var(--fds-focus-stroke)}.icon-button:hover{background-color:var(--fds-subtle-fill-secondary)}.icon-button:active{background-color:var(--fds-subtle-fill-tertiary);color:var(--fds-text-secondary)}.icon-button:disabled{background-color:var(--fds-subtle-fill-disabled);color:var(--fds-text-disabled)}.icon-button :global(svg){fill:currentColor;block-size:auto;inline-size:16px}</style>
