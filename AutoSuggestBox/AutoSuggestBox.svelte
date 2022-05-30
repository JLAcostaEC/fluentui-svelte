<script>import { createEventDispatcher } from "svelte";
import { uid } from "../internal";
import TextBox from "../TextBox/TextBox.svelte";
import ListItem from "../ListItem/ListItem.svelte";
/** @extends {"../TextBox/TextBox.svelte"} */
/** The input's current value. */
export let value = "";
/** Array of strings that will be suggested to the user as options. */
export let items = [];
/** The current visibility state of the suggestion flyout. */
export let open = false;
/** Bindable index of the currently selected item. */
export let selection = -1;
/** Bindable array of currently suggested items. */
export let matches = [];
/** Specifies a custom class name for the component. */
let className = "";
export { className as class };
/** Obtains a bound DOM reference to the input element. */
export let inputElement = null;
/** Obtains a bound DOM reference to the AutoSuggestBox's container element. */
export let containerElement = null;
/** Obtains a bound DOM reference to the AutoSuggestBox's buttons container element. */
export let buttonsContainerElement = null;
/** Obtains a bound DOM reference to the AutoSuggestBox's clear button element. Only available if `clearButton` is set to true, `readonly` is set to false, and a `value` is present. */
export let clearButtonElement = null;
/** Obtains a bound DOM reference to the AutoSuggestBox's search button element. Only available if `type` is set to `search`. */
export let searchButtonElement = null;
export let flyoutElement = null;
let focused = false;
let typedValue = "";
const dispatch = createEventDispatcher();
const flyoutId = uid("fds-auto-suggest-flyout-");
$: matches = items.filter(item => item.toLowerCase().includes(typedValue.toLowerCase()));
$: selection;
$: value, dispatchSelect();
function dispatchSelect() {
    value = matches[selection];
    dispatch("select", {
        item: items[selection] ? items[selection] : null,
        index: selection
    });
}
function handleInput() {
    typedValue = inputElement.value;
    if (focused && value && items.length > 0)
        open = true;
}
function handleKeyDown(event) {
    const { key } = event;
    if (open && matches.length > 0) {
        if (key === "ArrowDown") {
            selection++;
            if (selection > matches.length - 1)
                selection = 0;
        }
        else if (key === "ArrowUp") {
            selection--;
            if (selection < 0)
                selection = matches.length - 1;
        }
        else if (key === "Escape") {
            open = false;
        }
        if (key === "Enter" || key === "ArrowDown" || key === "ArrowUp") {
            event.preventDefault();
            flyoutElement === null || flyoutElement === void 0
                ? void 0
                : flyoutElement.children[selection].scrollIntoView({ block: "nearest" });
        }
        if (key === "Enter") {
            event.preventDefault();
            value = matches[selection];
            flyoutElement === null || flyoutElement === void 0
                ? void 0
                : flyoutElement.children[selection].scrollIntoView({ block: "nearest" });
        }
    }
    else if (!open && matches.length > 0 && (key === "ArrowDown" || key === "ArrowUp")) {
        open = true;
    }
}
</script>

<TextBox
	type="search"
	class="auto-suggest-box {open && matches.length > 0 ? 'open' : ''} {className}"
	aria-autocomplete="list"
	aria-activedescendant={open && matches.length > 0
		? `${flyoutId}-item-${items.indexOf(matches[selection])}`
		: ""}
	aria-expanded={open && matches.length > 0}
	aria-controls={flyoutId}
	on:search={() => {
		if (open && matches.length > 0) value = matches[selection];
	}}
	on:search
	on:input
	on:input={handleInput}
	on:outermousedown={() => (open = false)}
	on:focus={() => (focused = true)}
	on:focus
	on:blur={() => (focused = false)}
	on:blur
	on:keydown={handleKeyDown}
	on:keydown
	on:change
	on:beforeinput
	on:click
	on:dblclick
	on:contextmenu
	on:mousedown
	on:mouseup
	on:mouseover
	on:mouseout
	on:mouseenter
	on:mouseleave
	on:keypress
	on:keyup
	on:clear={() => {
		typedValue = "";
		if (items.length > 0) open = true;
	}}
	on:clear
	on:select={() => {
		if (open && matches.length > 0) value = matches[selection];
	}}
	on:select
	bind:inputElement
	bind:containerElement
	bind:clearButtonElement
	bind:searchButtonElement
	bind:buttonsContainerElement
	bind:value
	{...$$restProps}
>
	{#if open && matches.length > 0}
		<ul id={flyoutId} role="listbox" class="auto-suggest-box-flyout" bind:this={flyoutElement}>
			{#each matches as item, index (item)}
				<div class="auto-suggest-item-wrapper">
					<slot
						name="item-template"
						id="{flyoutId}-item-{index}"
						{value}
						{matches}
						{selection}
						{item}
						{index}
					>
						<ListItem
							tabindex={-1}
							id="{flyoutId}-item-{index}"
							role="option"
							on:click={() => {
								selection = index;
								value = matches[selection];
								open = false;
							}}
							selected={selection === index}>{item}</ListItem
						>
					</slot>
				</div>
			{/each}
		</ul>
	{/if}

	<slot />
	<slot name="buttons" slot="buttons" />
</TextBox>

<style>.auto-suggest-box-flyout{background-clip:padding-box;background-color:var(--fds-solid-background-quarternary);border:1px solid var(--fds-surface-stroke-flyout);border-end-end-radius:0;border-end-start-radius:0;border-radius:var(--fds-overlay-corner-radius);box-shadow:var(--fds-flyout-shadow);box-sizing:border-box;color:var(--fds-text-primary);inline-size:calc(100% + 2px);inset-block-start:calc(100% + 1px);inset-inline-start:-1px;margin:0;max-block-size:472px;overflow:auto;padding:0;padding-block:2px;position:absolute;z-index:100}.auto-suggest-item-wrapper{display:block}:global(.auto-suggest-box.open){background-color:var(--fds-control-fill-input-active)!important}:global(.auto-suggest-box.open) :global(.text-box-underline:after){border-bottom:2px solid var(--fds-accent-default);content:""}:global(.auto-suggest-box.open) :global(input::-moz-placeholder){color:var(--fds-text-tertiary)}:global(.auto-suggest-box.open) :global(input:-ms-input-placeholder){color:var(--fds-text-tertiary)}:global(.auto-suggest-box.open) :global(input::placeholder){color:var(--fds-text-tertiary)}:global(.auto-suggest-box.open) :global(.text-box-underline){border-bottom-left-radius:0;border-bottom-right-radius:0}</style>
