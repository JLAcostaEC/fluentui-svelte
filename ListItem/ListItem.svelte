<script>import { createEventDispatcher } from "svelte";
import { get_current_component } from "svelte/internal";
import { createEventForwarder } from "../internal";
import TextBlock from "../TextBlock/TextBlock.svelte";
/** @restProps {button | a} */
/** Controls whether the item is selected or not. */
export let selected = false;
/** Controls whether the item is intended for user interaction, and styles it accordingly. */
export let disabled = false;
/** Sets an href value and converts the list element into an anchor. */
export let href = "";
/** Specifies an ARIA role for the item. */
export let role = "listitem";
/** Specifies a custom class name for the item. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the item's element. */
export let element = null;
const forwardEvents = createEventForwarder(get_current_component(), ["select"]);
const dispatch = createEventDispatcher();
$: if (selected)
    dispatch("select");
function handleKeyDown({ key, target }) {
    if (key === "Enter")
        target.click();
}
</script>

<!--
@component
List Items display data stacked vertically in a single column. List Items work better for items that have text as a focal point, and for collections that are meant to be read top to bottom (i.e. alphabetically ordered). A few common use cases for List Items include lists of messages and search results. [Docs](https://fluent-svelte.vercel.app/docs/components/listitem)
- Usage:
    ```tsx
    <ListItem>Text</ListItem>
    ```
-->
{#if href && !disabled}
	<a
		use:forwardEvents
		on:keydown={handleKeyDown}
		bind:this={element}
		tabindex={disabled ? -1 : 0}
		aria-selected={selected}
		class="list-item {className}"
		class:selected
		class:disabled
		{href}
		{role}
		{...$$restProps}
	>
		<slot name="icon" />
		<TextBlock>
			<slot />
		</TextBlock>
	</a>
{:else}
	<li
		use:forwardEvents
		on:keydown={handleKeyDown}
		bind:this={element}
		tabindex={disabled ? -1 : 0}
		aria-selected={selected}
		class="list-item {className}"
		class:selected
		class:disabled
		{href}
		{role}
		{...$$restProps}
	>
		<slot name="icon" />
		<TextBlock>
			<slot />
		</TextBlock>
	</li>
{/if}

<style>.list-item{align-items:center;background-color:var(--fds-subtle-fill-transparent);block-size:34px;border-radius:var(--fds-control-corner-radius);box-sizing:border-box;color:var(--fds-text-primary);cursor:default;display:flex;flex:0 0 auto;inline-size:calc(100% - 10px);margin:3px 5px;outline:none;padding-inline:12px;position:relative;text-decoration:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.list-item:before{background-color:var(--fds-accent-default);block-size:16px;border-radius:3px;content:"";inline-size:3px;inset-inline-start:0;opacity:0;position:absolute;transform:scaleY(0);transition:transform var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing)}.list-item.selected:before{opacity:1;transform:scaleY(1)}.list-item:focus-visible{box-shadow:var(--fds-focus-stroke)}.list-item.selected,.list-item:hover{background-color:var(--fds-subtle-fill-secondary)}.list-item:active{background-color:var(--fds-subtle-fill-tertiary);color:var(--fds-text-secondary)}.list-item:active:before{transform:scaleY(.625)}.list-item.disabled{background-color:var(--fds-subtle-fill-transparent);color:var(--fds-text-disabled);pointer-events:none}.list-item.disabled.selected{background-color:var(--fds-subtle-fill-secondary)}.list-item.disabled.selected:before{background-color:var(--fds-accent-disabled)}.list-item>:global(svg){fill:currentColor;-webkit-margin-end:16px;block-size:auto;inline-size:16px;margin-inline-end:16px}</style>
